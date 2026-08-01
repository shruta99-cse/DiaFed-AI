from fastapi import FastAPI

from app.database import engine
from app.models.user import Base


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="DiaFed AI Backend",
    description="Explainable Federated Learning Framework for Early Diabetes Prediction",
    version="1.0"
)


@app.get("/")
def home():
    return {
        "message": "DiaFed AI Backend Running Successfully"
    }