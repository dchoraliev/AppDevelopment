from fastapi import FastAPI
from pymongo import MongoClient
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
# --- MongoDB connection ---
uri = "mongodb+srv://devinjhall_db_user:VgpwWlGmjB3BUOPw@workouts.g4zqr5n.mongodb.net/?appName=Workouts"
client = MongoClient(uri)
db = client["cs3720db"] # Database name
collection = db["robots"] # Collection name (not robots.json, just robots)
# --- FastAPI app setup ---
app = FastAPI()
# Optional: enable CORS if you’ll connect from React/React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # or specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- Root endpoint ---
@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI + MongoDB Atlas backend!"}
# --- Get all robots ---
@app.get("/robots")
def get_robots():
    robots = list(collection.find()) # Retrieve all documents
    for r in robots:
        r["_id"] = str(r["_id"]) # Convert ObjectId to string
    return robots