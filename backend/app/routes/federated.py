from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.auth import get_current_user
from app.ml import federated

router = APIRouter(prefix="/api/federated", tags=["Federated Learning"])


class ClinicalFeatures(BaseModel):
    pregnancies: float = 0
    glucose: float
    blood_pressure: float
    skin_thickness: float = 20
    insulin: float = 85
    bmi: float
    dpf: float = 0.47
    age: float


@router.post("/upload")
async def upload_hospital_csvs(
    hospital_a: UploadFile = File(...), hospital_b: UploadFile = File(...), hospital_c: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    files = {"hospital_a": hospital_a, "hospital_b": hospital_b, "hospital_c": hospital_c}
    for name, upload in files.items():
        if not (upload.filename or "").lower().endswith(".csv"):
            raise HTTPException(400, f"{name.replace('_', ' ').title()} must be a CSV file.")
        try:
            federated.save_upload(name, await upload.read())
        except ValueError as exc:
            raise HTTPException(400, str(exc)) from exc
    return {"message": "Three hospital CSVs uploaded separately.", "status": federated.get_status()}


@router.post("/preprocess")
def preprocess(current_user=Depends(get_current_user)):
    try:
        _, summaries = federated.preprocess_uploaded_data()
        return {"message": "Preprocessing complete.", "hospitals": summaries}
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@router.post("/train")
def train(background_tasks: BackgroundTasks, rounds: int = 3, current_user=Depends(get_current_user)):
    status = federated.get_status()
    if status["state"] in {"preprocessing", "training", "aggregating"}:
        raise HTTPException(409, "Federated training is already running.")
    if not 1 <= rounds <= 10:
        raise HTTPException(400, "rounds must be between 1 and 10.")
    federated.mark_training_queued()
    background_tasks.add_task(federated.train_federated, rounds)
    return {"message": "Federated training started.", "status": federated.get_status()}


@router.get("/status")
def status(current_user=Depends(get_current_user)):
    return federated.get_status()


@router.get("/evaluation")
def evaluate_global_model(current_user=Depends(get_current_user)):
    """Return live classification metrics for the saved global federated model."""
    try:
        return federated.evaluate_global_model()
    except (FileNotFoundError, ValueError) as exc:
        raise HTTPException(409, str(exc)) from exc


@router.post("/predict")
def predict(data: ClinicalFeatures, current_user=Depends(get_current_user)):
    from app.ml.prediction import predict_diabetes_risk
    try:
        return predict_diabetes_risk(**data.model_dump())
    except FileNotFoundError as exc:
        raise HTTPException(409, str(exc)) from exc


@router.post("/explain")
def explain(data: ClinicalFeatures, current_user=Depends(get_current_user)):
    from app.ml.prediction import predict_diabetes_risk
    try:
        result = predict_diabetes_risk(**data.model_dump())
        return {"prediction": result["prediction"], "probability": result["probability"], "shap_explanation": result["shap_explanation"]}
    except FileNotFoundError as exc:
        raise HTTPException(409, str(exc)) from exc
