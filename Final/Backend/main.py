from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError
from datetime import datetime, timedelta
import bcrypt
import secrets
import string

from pymongo import MongoClient
from pymongo.errors import PyMongoError
from bson import ObjectId


# ======================================================
# MongoDB connection
# ======================================================
uri = "mongodb+srv://devinjhall_db_user:VgpwWlGmjB3BUOPw@workouts.g4zqr5n.mongodb.net/?appName=Workouts"
client = MongoClient(uri)

db = client["gymsync_db"]
users_collection = db["users"]
workouts_collection = db["workouts"]


# ======================================================
# FastAPI app
# ======================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/hello")
def hello():
    return {"message": "Hello from GymSync API"}


# ======================================================
# JWT CONFIG
# ======================================================
SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_ME"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 14

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


# ======================================================
# BCRYPT HELPERS
# ======================================================
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


# ======================================================
# JWT HELPERS
# ======================================================
def create_jwt_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ======================================================
# SERIALIZER
# ======================================================
def serialize_doc(doc: dict) -> dict:
    if not doc:
        return doc
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ======================================================
# JOIN CODE HELPERS
# ======================================================
JOIN_CODE_LEN = 6
JOIN_CODE_ALPHABET = string.ascii_uppercase + string.digits


def generate_join_code() -> str:
    return "".join(secrets.choice(JOIN_CODE_ALPHABET) for _ in range(JOIN_CODE_LEN))


def generate_unique_join_code() -> str:
    # Try a few times; collisions are extremely unlikely, but we still guard.
    for _ in range(20):
        code = generate_join_code()
        if not workouts_collection.find_one({"join_code": code}):
            return code
    raise HTTPException(status_code=503, detail="Could not generate join code")


# ======================================================
# Pydantic MODELS
# ======================================================
class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    token: str


class Exercise(BaseModel):
    name: str
    sets: int = 0
    reps: int = 0
    weight: float | None = None  # NEW


class WorkoutCreate(BaseModel):
    title: str
    description: str | None = None
    muscleGroup: str
    duration: int
    difficulty: str
    exercises: list[Exercise] = Field(default_factory=list)  # creator's exercises


class WorkoutUpdate(BaseModel):
    # Shared fields (only owner can edit)
    title: str | None = None
    description: str | None = None
    muscleGroup: str | None = None
    duration: int | None = None
    difficulty: str | None = None

    # Member-specific exercises (any member can edit their own)
    exercises: list[Exercise] | None = None


class JoinWorkoutRequest(BaseModel):
    join_code: str


# ======================================================
# AUTH HELPERS
# ======================================================
def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})


# ======================================================
# SIGNUP
# ======================================================
@app.post("/signup")
def signup(user: UserCreate):
    try:
        if users_collection.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_pw = hash_password(user.password)
        users_collection.insert_one({
            "email": user.email,
            "password": hashed_pw
        })

        return {"msg": "signup ok"}

    except PyMongoError as e:
        print("DB error:", e)
        raise HTTPException(status_code=503, detail="Database error")


# ======================================================
# LOGIN
# ======================================================
@app.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = get_user_by_email(user.email)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_jwt_token({"sub": db_user["email"]})
    return {"token": token}


# ======================================================
# AUTH DEPENDENCY
# ======================================================
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return email

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ======================================================
# PROTECTED ROUTES
# ======================================================
@app.get("/protected")
def protected(current_user: str = Depends(get_current_user)):
    return {"msg": f"Hello {current_user}, protected access granted"}


# ======================================================
# WORKOUTS – GET LIST (MEMBER ONLY)
# Returns workouts where current_user is in members
# ======================================================
@app.get("/workouts")
def get_workouts(current_user: str = Depends(get_current_user)):
    try:
        workouts = list(
            workouts_collection.find({"members": current_user})
        )
        return [serialize_doc(w) for w in workouts]
    except PyMongoError as e:
        print("DB error:", e)
        raise HTTPException(status_code=503, detail="Database not reachable")


# ======================================================
# WORKOUTS – POST (CREATE)
# Generates join_code + initializes per-user exercises
# ======================================================
@app.post("/workouts", status_code=status.HTTP_201_CREATED)
def add_workout(workout: WorkoutCreate, current_user: str = Depends(get_current_user)):
    try:
        join_code = generate_unique_join_code()

        workout_doc = {
            "title": workout.title,
            "description": workout.description,
            "muscleGroup": workout.muscleGroup,
            "duration": workout.duration,
            "difficulty": workout.difficulty,

            "join_code": join_code,
            "owner_email": current_user,
            "members": [current_user],

            # per-user exercises
            "exercises_by_user": {
                current_user: [e.dict() for e in workout.exercises]
            },

            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        result = workouts_collection.insert_one(workout_doc)
        return {"id": str(result.inserted_id), "join_code": join_code}

    except PyMongoError as e:
        print("DB error:", e)
        raise HTTPException(status_code=503, detail="Database not reachable")


# ======================================================
# WORKOUTS – GET ONE (MEMBER ONLY)
# ======================================================
@app.get("/workouts/{workout_id}")
def get_workout(workout_id: str, current_user: str = Depends(get_current_user)):
    try:
        workout = workouts_collection.find_one({
            "_id": ObjectId(workout_id),
            "members": current_user
        })
        if not workout:
            raise HTTPException(status_code=404, detail="Workout not found")

        return serialize_doc(workout)

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid workout id")


# ======================================================
# WORKOUTS – PUT (UPDATE)
# Owner can edit shared fields; any member can edit their own exercises
# ======================================================
@app.put("/workouts/{workout_id}")
def update_workout(workout_id: str, payload: WorkoutUpdate, current_user: str = Depends(get_current_user)):
    try:
        workout = workouts_collection.find_one({
            "_id": ObjectId(workout_id),
            "members": current_user
        })
        if not workout:
            raise HTTPException(status_code=404, detail="Workout not found")

        update_ops = {"$set": {"updated_at": datetime.utcnow()}}

        # Shared fields: owner only
        if workout.get("owner_email") == current_user:
            shared_updates = {}
            if payload.title is not None:
                shared_updates["title"] = payload.title
            if payload.description is not None:
                shared_updates["description"] = payload.description
            if payload.muscleGroup is not None:
                shared_updates["muscleGroup"] = payload.muscleGroup
            if payload.duration is not None:
                shared_updates["duration"] = payload.duration
            if payload.difficulty is not None:
                shared_updates["difficulty"] = payload.difficulty

            if shared_updates:
                update_ops["$set"].update(shared_updates)

        # Member exercises: any member can update their own
        if payload.exercises is not None:
            path = f"exercises_by_user.{current_user}"
            update_ops["$set"][path] = [e.dict() for e in payload.exercises]

        workouts_collection.update_one(
            {"_id": ObjectId(workout_id)},
            update_ops
        )

        return {"message": "Workout updated successfully"}

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid workout id")


# ======================================================
# WORKOUTS – DELETE
# Owner deletes workout; non-owner leaves workout
# ======================================================
@app.delete("/workouts/{workout_id}")
def delete_workout(workout_id: str, current_user: str = Depends(get_current_user)):
    try:
        workout = workouts_collection.find_one({
            "_id": ObjectId(workout_id),
            "members": current_user
        })
        if not workout:
            raise HTTPException(status_code=404, detail="Workout not found")

        owner = workout.get("owner_email")
        if owner == current_user:
            # Owner deletes entire workout
            workouts_collection.delete_one({"_id": ObjectId(workout_id)})
            return {"message": "Workout deleted"}
        else:
            # Member leaves workout: remove from members and remove their exercise data
            workouts_collection.update_one(
                {"_id": ObjectId(workout_id)},
                {
                    "$pull": {"members": current_user},
                    "$unset": {f"exercises_by_user.{current_user}": ""},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            return {"message": "Left workout"}

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid workout id")


# ======================================================
# WORKOUTS – JOIN BY CODE
# ======================================================
@app.post("/workouts/join")
def join_workout(req: JoinWorkoutRequest, current_user: str = Depends(get_current_user)):
    code = (req.join_code or "").strip().upper()
    if len(code) != JOIN_CODE_LEN:
        raise HTTPException(status_code=400, detail="Invalid join code")

    workout = workouts_collection.find_one({"join_code": code})
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    workout_id = workout["_id"]

    # If already a member, just return ok
    if current_user in (workout.get("members") or []):
        return {"message": "Already joined", "id": str(workout_id)}

    # Add to members and initialize empty exercise list for this user
    workouts_collection.update_one(
        {"_id": workout_id},
        {
            "$addToSet": {"members": current_user},
            "$set": {
                f"exercises_by_user.{current_user}": [],
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {"message": "Joined workout", "id": str(workout_id)}
