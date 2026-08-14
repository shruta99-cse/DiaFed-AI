from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.ml.baselines import (
    evaluate_logistic_regression_baseline,
    evaluate_random_forest_baseline,
    evaluate_svm_baseline,
)


router = APIRouter(
    prefix="/api/baselines",
    tags=["Baseline Models"]
)


@router.get("/logistic-regression")
def logistic_regression_baseline(
    current_user=Depends(get_current_user)
):
    """Dynamically train/evaluate the centralized Logistic Regression baseline."""
    try:
        return evaluate_logistic_regression_baseline()
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc)
        ) from exc


@router.get("/random-forest")
def random_forest_baseline(
    current_user=Depends(get_current_user)
):
    """Dynamically train/evaluate the centralized Random Forest baseline."""
    try:
        return evaluate_random_forest_baseline()
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc)
        ) from exc


@router.get("/svm")
def svm_baseline(
    current_user=Depends(get_current_user)
):
    """Dynamically train/evaluate the centralized SVM baseline."""
    try:
        return evaluate_svm_baseline()
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc)
        ) from exc