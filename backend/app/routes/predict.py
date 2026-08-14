import json
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient, PredictionRecord, ActivityLog
from app.models.user import User
from app.auth import get_current_user
from app.schemas import PredictionInput, PredictionOutput
from app.ml.prediction import predict_diabetes_risk


router = APIRouter(
    prefix="/api/predict",
    tags=["Diabetes Prediction"]
)


@router.post("", response_model=PredictionOutput)
def run_prediction(
    data: PredictionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # =====================================================
    # 1. RUN ML MODEL + SHAP
    # =====================================================

    insulin = data.insulin or 85.0
    dpf = data.dpf or 0.47
    pregnancies = data.pregnancies or 0
    skin_thickness = data.skin_thickness or 20.0

    result = predict_diabetes_risk(
        glucose=data.glucose,
        bmi=data.bmi,
        age=data.age,
        blood_pressure=data.blood_pressure,
        insulin=insulin,
        dpf=dpf,
        pregnancies=pregnancies,
        skin_thickness=skin_thickness
    )

    # SHAP explanation is already generated
    # inside predict_diabetes_risk()

    shap_features = result["shap_explanation"]


    # =====================================================
    # 2. CREATE SHAP JSON
    # =====================================================

    shap_json = json.dumps(
        shap_features
    )


    # =====================================================
    # 3. FIND PATIENT
    #
    # IMPORTANT:
    # Search only inside the logged-in doctor's patients.
    # =====================================================

    existing_patient = (
        db.query(Patient)
        .filter(
            Patient.name == data.patient_name,
            Patient.doctor_id == current_user.id
        )
        .first()
    )


    # =====================================================
    # 4. UPDATE EXISTING PATIENT
    # =====================================================

    if existing_patient:

        existing_patient.age = data.age
        existing_patient.gender = (
            data.gender
            if hasattr(data, "gender") and data.gender
            else existing_patient.gender or "Female"
        )

        existing_patient.glucose = data.glucose
        existing_patient.blood_pressure = data.blood_pressure
        existing_patient.skin_thickness = skin_thickness
        existing_patient.insulin = insulin
        existing_patient.bmi = data.bmi
        existing_patient.dpf = dpf
        existing_patient.pregnancies = pregnancies

        # ML result
        existing_patient.risk_level = result["risk_level"]
        existing_patient.prediction = result["prediction"]
        existing_patient.confidence = result["confidence"]

        # SHAP explanation
        existing_patient.shap_explanation = shap_json

        db.flush()

        patient = existing_patient


    # =====================================================
    # 5. CREATE NEW PATIENT
    # =====================================================

    else:

        new_patient = Patient(
            name=data.patient_name,
            age=data.age,

            gender=(
                data.gender
                if hasattr(data, "gender") and data.gender
                else "Female"
            ),

            glucose=data.glucose,
            blood_pressure=data.blood_pressure,
            skin_thickness=skin_thickness,
            insulin=insulin,
            bmi=data.bmi,
            dpf=dpf,
            pregnancies=pregnancies,

            # ML result
            risk_level=result["risk_level"],
            prediction=result["prediction"],
            confidence=result["confidence"],

            # SHAP
            shap_explanation=shap_json,

            # Doctor ownership
            doctor_id=current_user.id
        )

        db.add(new_patient)

        db.flush()

        patient = new_patient


    # =====================================================
    # 6. SAVE PREDICTION AUDIT RECORD
    # =====================================================

    prediction_record = PredictionRecord(
        patient_name=data.patient_name,
        age=data.age,
        glucose=data.glucose,
        bmi=data.bmi,

        risk_level=result["risk_level"],
        prediction=result["prediction"],
        probability=result["probability"],
        confidence=result["confidence"],

        # SHAP JSON
        shap_summary=shap_json,

        doctor_id=current_user.id
    )

    db.add(prediction_record)


    # =====================================================
    # 7. ACTIVITY LOG
    # =====================================================

    activity = ActivityLog(
        title="Diabetes prediction completed",

        detail=(
            f"Patient {data.patient_name} · "
            f"{result['risk_level']} Risk "
            f"({result['confidence']}% confidence)"
        ),

        activity_type="prediction",
        time_ago="Just now"
    )

    db.add(activity)


    # =====================================================
    # 8. COMMIT EVERYTHING
    # =====================================================

    db.commit()

    db.refresh(patient)
    db.refresh(prediction_record)


    # =====================================================
    # 9. RETURN API RESPONSE
    # =====================================================

    return {
        "id": prediction_record.id,
        "patient_name": data.patient_name,
        "age": data.age,
        "glucose": data.glucose,
        "bmi": data.bmi,

        "risk_level": result["risk_level"],
        "prediction": result["prediction"],
        "probability": result["probability"],
        "confidence": result["confidence"],

        # Explainable AI
        "shap_explanation": shap_features,

        "created_at": datetime.now()
    }