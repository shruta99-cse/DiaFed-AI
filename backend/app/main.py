from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, Base, SessionLocal
from app.models import User, Patient, PredictionRecord, ActivityLog
from app.auth import hash_password

from app.routes import login, dashboard, patients, predict, analytics, reports, settings, federated, baselines

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
    allow_origins=["*"],  # Allow all frontend dev origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(login.router)
app.include_router(dashboard.router)
app.include_router(patients.router)
app.include_router(predict.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(settings.router)
app.include_router(federated.router)
app.include_router(baselines.router)


@app.on_event("startup")
def seed_initial_data():
    """Seeds initial doctor accounts and sample patient records if DB is empty."""
    db: Session = SessionLocal()
    try:
        # Check users
        if db.query(User).count() == 0:
            shruti = User(
                name="Shruti",
                email="shruti@diafed.ai",
                hashed_password=hash_password("password123"),
                role="doctor"
            )
            rahul = User(
                name="Dr. Rahul",
                email="rahul@diafed.ai",
                hashed_password=hash_password("password123"),
                role="doctor"
            )
            db.add_all([shruti, rahul])
            db.commit()

        # Seed sample patients if empty
        if db.query(Patient).count() == 0:
            sample_patients = [
                Patient(
                    name="Aarav Sharma",
                    age=45,
                    gender="Male",
                    glucose=162.0,
                    blood_pressure=84.0,
                    skin_thickness=28.0,
                    insulin=140.0,
                    bmi=31.4,
                    risk_level="High",
                    prediction="Positive",
                    confidence=96.4
                ),
                Patient(
                    name="Priya Patel",
                    age=36,
                    gender="Female",
                    glucose=118.0,
                    blood_pressure=72.0,
                    skin_thickness=20.0,
                    insulin=90.0,
                    bmi=24.2,
                    risk_level="Low",
                    prediction="Negative",
                    confidence=98.1
                ),
                Patient(
                    name="Rohan Mehta",
                    age=51,
                    gender="Male",
                    glucose=148.0,
                    blood_pressure=88.0,
                    skin_thickness=32.0,
                    insulin=160.0,
                    bmi=29.8,
                    risk_level="Moderate",
                    prediction="Monitor",
                    confidence=89.5
                ),
                Patient(
                    name="Sneha Joshi",
                    age=42,
                    gender="Female",
                    glucose=171.0,
                    blood_pressure=90.0,
                    skin_thickness=35.0,
                    insulin=180.0,
                    bmi=34.6,
                    risk_level="High",
                    prediction="Positive",
                    confidence=97.8
                ),
                Patient(
                    name="Vikram Malhotra",
                    age=58,
                    gender="Male",
                    glucose=105.0,
                    blood_pressure=76.0,
                    skin_thickness=22.0,
                    insulin=70.0,
                    bmi=23.5,
                    risk_level="Low",
                    prediction="Negative",
                    confidence=99.2
                )
            ]
            db.add_all(sample_patients)
            db.commit()
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "status": "online",
        "service": "DiaFed AI Healthcare API Server",
        "version": "1.0"
    }
