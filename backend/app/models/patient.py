from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from datetime import datetime
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    # Patient information
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), default="Female")

    # Clinical features
    glucose = Column(Float, nullable=False)
    blood_pressure = Column(Float, nullable=False)
    skin_thickness = Column(Float, default=20.0)
    insulin = Column(Float, default=80.0)
    bmi = Column(Float, nullable=False)
    dpf = Column(Float, default=0.47)
    pregnancies = Column(Integer, default=0)

    # ML prediction
    risk_level = Column(
        String(20),
        nullable=False
    )

    prediction = Column(
        String(20),
        nullable=False
    )

    confidence = Column(
        Float,
        default=95.0
    )

    # SHAP explanation
    # Stored as JSON string
    shap_explanation = Column(
        Text,
        nullable=True
    )

    # Metadata
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    doctor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )


class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True)

    patient_name = Column(
        String(100),
        nullable=False
    )

    age = Column(
        Integer,
        nullable=False
    )

    glucose = Column(
        Float,
        nullable=False
    )

    bmi = Column(
        Float,
        nullable=False
    )

    risk_level = Column(
        String(20),
        nullable=False
    )

    prediction = Column(
        String(20),
        nullable=False
    )

    probability = Column(
        Float,
        nullable=False
    )

    confidence = Column(
        Float,
        nullable=False
    )

    # JSON string of SHAP feature attributions
    shap_summary = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    doctor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(
        String(255),
        nullable=False
    )

    detail = Column(
        Text,
        nullable=False
    )

    activity_type = Column(
        String(50),
        default="prediction"
    )

    time_ago = Column(
        String(50),
        default="Just now"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )