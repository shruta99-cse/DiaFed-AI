from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models.user import Base
from app.routes import login

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DiaFed AI Backend",
    description="Explainable Federated Learning Framework for Early Diabetes Prediction",
    version="1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(login.router)

@app.get("/")
def home():
    return {
        "message": "DiaFed AI Backend Running Successfully"
    }