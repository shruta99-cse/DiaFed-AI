from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.patient import Patient
from app.models.user import User
from app.auth import get_current_user
from app.schemas import PatientCreate, PatientResponse
from app.ml.prediction import predict_diabetes_risk

router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"]
)


# =========================================================
# GET ALL PATIENTS FOR LOGGED-IN DOCTOR
# =========================================================

@router.get("", response_model=List[PatientResponse])
def get_patients(
    search: Optional[str] = None,
    risk: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # IMPORTANT:
    # Only patients belonging to the logged-in doctor
    query = db.query(Patient).filter(
        Patient.doctor_id == current_user.id
    )

    # Search by patient name
    if search:
        query = query.filter(
            Patient.name.ilike(f"%{search}%")
        )

    # Filter by risk level
    if risk and risk != "All":
        query = query.filter(
            Patient.risk_level == risk
        )

    # Latest patients first
    patients = query.order_by(
        Patient.created_at.desc()
    ).all()

    return patients


# =========================================================
# CREATE NEW PATIENT / PREDICTION
# =========================================================

@router.post("", response_model=PatientResponse)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Calculate ML prediction
    prediction_result = predict_diabetes_risk(
        glucose=patient_data.glucose,
        bmi=patient_data.bmi,
        age=patient_data.age,
        blood_pressure=patient_data.blood_pressure,
        insulin=patient_data.insulin or 80.0,
        dpf=patient_data.dpf or 0.47,
        pregnancies=patient_data.pregnancies or 0
    )

    # Create patient
    new_patient = Patient(
        name=patient_data.name,
        age=patient_data.age,
        gender=patient_data.gender or "Female",
        glucose=patient_data.glucose,
        blood_pressure=patient_data.blood_pressure,
        skin_thickness=patient_data.skin_thickness or 20.0,
        insulin=patient_data.insulin or 80.0,
        bmi=patient_data.bmi,
        dpf=patient_data.dpf or 0.47,
        pregnancies=patient_data.pregnancies or 0,

        # ML result
        risk_level=prediction_result["risk_level"],
        prediction=prediction_result["prediction"],
        confidence=prediction_result["confidence"],

        # VERY IMPORTANT
        # Patient belongs to currently logged-in doctor
        doctor_id=current_user.id
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


# =========================================================
# GET SINGLE PATIENT
# =========================================================

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient_by_id(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # IMPORTANT:
    # Doctor can only access THEIR OWN patient
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.doctor_id == current_user.id
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient