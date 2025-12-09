from typing import List, Literal, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId

# --- MongoDB connection ---
# Use the same URI you already have in your template
uri = "mongodb+srv://devinjhall_db_user:VgpwWlGmjB3BUOPw@workouts.g4zqr5n.mongodb.net/?appName=Workouts"
client = MongoClient(uri)

db = client["GymSync"]  # Database name in Atlas

workouts_col = db["workouts"]
users_col = db["users"]
exercises_col = db["exercises"]


# --- Pydantic models (request bodies) ---

class Workout(BaseModel):
    title: str
    description: str
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
    author: str              # this matches your user "id" field (UUID string)
    duration: int
    calories: int
    colaborators: List[str] = []   # list of user "id" strings
    exercises: List[int] = []      # list of exercise numeric ids


class User(BaseModel):
    id: str                  # "1361ff6a-..." style id
    firstName: str
    lastName: str
    email: Optional[str] = None
    password: Optional[str] = None


class Exercise(BaseModel):
    id: int
    name: str
    sets: int
    reps: int
    repType: Literal["Reps", "Seconds"]


# --- FastAPI app setup ---

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Helpers ---

def serialize_doc(doc: dict) -> dict:
    """Convert Mongo ObjectId to string for JSON responses."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# --- Root endpoint ---

@app.get("/")
def read_root():
    return {"message": "Hello from GymSync FastAPI + MongoDB backend!"}


# -------- WORKOUTS --------

@app.get("/workouts")
def get_workouts():
    workouts = [serialize_doc(d) for d in workouts_col.find()]
    return workouts


@app.get("/workouts/{workout_id}")
def get_workout(workout_id: str):
    doc = workouts_col.find_one({"_id": ObjectId(workout_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Workout not found")
    return serialize_doc(doc)


@app.post("/workouts")
def create_workout(workout: Workout):
    result = workouts_col.insert_one(workout.dict())
    created = workouts_col.find_one({"_id": result.inserted_id})
    return serialize_doc(created)


# -------- USERS --------

@app.get("/users")
def get_users():
    users = [serialize_doc(d) for d in users_col.find()]
    return users


@app.get("/users/{user_id}")
def get_user(user_id: str):
    doc = users_col.find_one({"id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_doc(doc)


@app.post("/users")
def create_user(user: User):
    #  controlling the "id" field manually, let Mongo make _id
    result = users_col.insert_one(user.dict())
    created = users_col.find_one({"_id": result.inserted_id})
    return serialize_doc(created)


# -------- EXERCISES --------

@app.get("/exercises")
def get_exercises():
    exercises = [serialize_doc(d) for d in exercises_col.find()]
    return exercises


@app.get("/exercises/{exercise_id}")
def get_exercise(exercise_id: int):
    doc = exercises_col.find_one({"id": exercise_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return serialize_doc(doc)


@app.post("/exercises")
def create_exercise(exercise: Exercise):
    result = exercises_col.insert_one(exercise.dict())
    created = exercises_col.find_one({"_id": result.inserted_id})
    return serialize_doc(created)
