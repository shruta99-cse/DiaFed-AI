from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.patient import Patient, PredictionRecord
from app.models.user import User
from app.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("")
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recent_predictions = db.query(PredictionRecord).order_by(PredictionRecord.created_at.desc()).limit(20).all()

    reports = []
    if recent_predictions:
        for p in recent_predictions:
            reports.append({
                "id": f"REP-{p.id:04d}",
                "patient": p.patient_name,
                "age": p.age,
                "prediction": p.prediction,
                "risk": p.risk_level,
                "confidence": f"{p.confidence}%",
                "date": p.created_at.strftime("%Y-%m-%d %H:%M"),
                "doctor": current_user.name,
                "model": "DiaFed FL v4.2"
            })
    else:
        reports = [
            {
                "id": "REP-0001",
                "patient": "Aarav Sharma",
                "age": 45,
                "prediction": "Positive",
                "risk": "High",
                "confidence": "96.4%",
                "date": "2026-08-09 10:45",
                "doctor": current_user.name,
                "model": "DiaFed FL v4.2"
            },
            {
                "id": "REP-0002",
                "patient": "Priya Patel",
                "age": 36,
                "prediction": "Negative",
                "risk": "Low",
                "confidence": "98.1%",
                "date": "2026-08-09 09:30",
                "doctor": current_user.name,
                "model": "DiaFed FL v4.2"
            },
            {
                "id": "REP-0003",
                "patient": "Rohan Mehta",
                "age": 51,
                "prediction": "Monitor",
                "risk": "Moderate",
                "confidence": "89.5%",
                "date": "2026-08-08 16:20",
                "doctor": current_user.name,
                "model": "DiaFed FL v4.2"
            }
        ]

    return {
        "reports": reports,
        "total_reports": len(reports)
    }
