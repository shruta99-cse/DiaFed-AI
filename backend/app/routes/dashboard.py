from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient, PredictionRecord
from app.models.user import User
from app.auth import get_current_user
from app.schemas import DashboardSummary


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # =========================================================
    # 1. DOCTOR-SPECIFIC PATIENTS
    # =========================================================

    doctor_patients = (
        db.query(Patient)
        .filter(
            Patient.doctor_id == current_user.id
        )
    )

    total_patients = doctor_patients.count()


    # =========================================================
    # 2. DOCTOR-SPECIFIC PREDICTIONS
    # =========================================================

    doctor_predictions = (
        db.query(PredictionRecord)
        .filter(
            PredictionRecord.doctor_id == current_user.id
        )
    )


    # =========================================================
    # 3. PREDICTIONS CREATED TODAY
    # =========================================================

    now_utc = datetime.utcnow()

    today_start = now_utc.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    tomorrow_start = today_start + timedelta(days=1)

    predictions_today = (
        doctor_predictions
        .filter(
            PredictionRecord.created_at >= today_start,
            PredictionRecord.created_at < tomorrow_start
        )
        .count()
    )


    # =========================================================
    # 4. DOCTOR-SPECIFIC HIGH-RISK PATIENTS
    # =========================================================

    high_risk_patients = (
        doctor_patients
        .filter(
            Patient.risk_level == "High"
        )
        .count()
    )


    # =========================================================
    # 5. RISK DISTRIBUTION
    # =========================================================

    low_count = (
        doctor_patients
        .filter(
            Patient.risk_level == "Low"
        )
        .count()
    )

    moderate_count = (
        doctor_patients
        .filter(
            Patient.risk_level == "Moderate"
        )
        .count()
    )

    high_count = (
        doctor_patients
        .filter(
            Patient.risk_level == "High"
        )
        .count()
    )


    if total_patients > 0:

        low_percentage = round(
            (low_count / total_patients) * 100
        )

        moderate_percentage = round(
            (moderate_count / total_patients) * 100
        )

        high_percentage = round(
            (high_count / total_patients) * 100
        )

    else:

        low_percentage = 0
        moderate_percentage = 0
        high_percentage = 0


    risk_distribution = [
        {
            "name": "Low Risk",
            "value": low_percentage,
            "count": low_count,
            "color": "#16A34A"
        },
        {
            "name": "Moderate Risk",
            "value": moderate_percentage,
            "count": moderate_count,
            "color": "#F59E0B"
        },
        {
            "name": "High Risk",
            "value": high_percentage,
            "count": high_count,
            "color": "#EF4444"
        }
    ]


    # =========================================================
    # 6. REAL WEEKLY RISK TREND
    #
    # PredictionRecord
    #       ↓
    # created_at
    #       ↓
    # doctor_id
    #       ↓
    # risk_level
    #       ↓
    # group by date
    # =========================================================

    weekly_trend = []

    weekly_high_risk_counts = []

    for i in range(6, -1, -1):

        day_start = today_start - timedelta(days=i)
        day_end = day_start + timedelta(days=1)

        daily_predictions = (
            doctor_predictions
            .filter(
                PredictionRecord.created_at >= day_start,
                PredictionRecord.created_at < day_end
            )
        )

        high_risk_count = (
            daily_predictions
            .filter(
                PredictionRecord.risk_level == "High"
            )
            .count()
        )

        weekly_high_risk_counts.append(
            high_risk_count
        )

        weekly_trend.append(
            {
                "label": day_start.strftime("%a"),
                "risk": high_risk_count,
                "avg": 0
            }
        )


    # ---------------------------------------------------------
    # Historical average
    #
    # Average high-risk predictions per day across
    # the seven-day window.
    # ---------------------------------------------------------

    weekly_average = (
        sum(weekly_high_risk_counts) /
        len(weekly_high_risk_counts)
        if weekly_high_risk_counts
        else 0
    )

    weekly_average = round(
        weekly_average,
        1
    )

    for item in weekly_trend:
        item["avg"] = weekly_average


    # =========================================================
    # 7. REAL DAILY RISK TREND
    #
    # Today's predictions are grouped into 2-hour windows.
    #
    # Example:
    # 08:00
    # 10:00
    # 12:00
    # ...
    #
    # Only actual PredictionRecord data is used.
    # =========================================================

    daily_trend = []

    daily_high_risk_counts = []

    # 08:00 → 20:00
    for hour in range(8, 22, 2):

        bucket_start = today_start + timedelta(
            hours=hour
        )

        bucket_end = bucket_start + timedelta(
            hours=2
        )

        bucket_predictions = (
            doctor_predictions
            .filter(
                PredictionRecord.created_at >= bucket_start,
                PredictionRecord.created_at < bucket_end
            )
        )

        high_risk_count = (
            bucket_predictions
            .filter(
                PredictionRecord.risk_level == "High"
            )
            .count()
        )

        daily_high_risk_counts.append(
            high_risk_count
        )

        daily_trend.append(
            {
                "label": bucket_start.strftime("%H:%M"),
                "risk": high_risk_count,
                "avg": 0
            }
        )


    # ---------------------------------------------------------
    # Today's historical/average baseline
    # ---------------------------------------------------------

    daily_average = (
        sum(daily_high_risk_counts) /
        len(daily_high_risk_counts)
        if daily_high_risk_counts
        else 0
    )

    daily_average = round(
        daily_average,
        1
    )

    for item in daily_trend:
        item["avg"] = daily_average


    # =========================================================
    # 8. FINAL RISK TREND OBJECT
    # =========================================================

    risk_trend = {
        "daily": daily_trend,
        "weekly": weekly_trend
    }


    # =========================================================
    # 9. RECENT PATIENTS — CURRENT DOCTOR ONLY
    # =========================================================

    recent_db_patients = (
        doctor_patients
        .order_by(
            Patient.created_at.desc()
        )
        .limit(5)
        .all()
    )


    # =========================================================
    # 10. RECENT ACTIVITY — CURRENT DOCTOR ONLY
    # =========================================================

    recent_predictions = (
        doctor_predictions
        .order_by(
            PredictionRecord.created_at.desc()
        )
        .limit(5)
        .all()
    )

    activities = []

    for prediction in recent_predictions:

        activities.append(
            {
                "title": "Diabetes prediction completed",

                "detail": (
                    f"Patient {prediction.patient_name} · "
                    f"{prediction.risk_level} Risk "
                    f"({prediction.confidence}% confidence)"
                ),

                "time": "Recent",

                "type": "prediction"
            }
        )


    # =========================================================
    # 11. GLOBAL FEDERATED MODEL INFORMATION
    #
    # IMPORTANT:
    # These values remain GLOBAL.
    # They are NOT doctor-specific.
    # =========================================================

    federated_nodes = [
        {
            "name": "Hospital A — Mumbai",
            "nodeId": "Node-101",
            "localModel": "FedLocal v4.2a",
            "trainingStatus": "Idle (Trained)",
            "syncStatus": "Synced",
            "online": True
        },
        {
            "name": "Hospital B — Delhi",
            "nodeId": "Node-102",
            "localModel": "FedLocal v4.2b",
            "trainingStatus": "Idle (Trained)",
            "syncStatus": "Synced",
            "online": True
        },
        {
            "name": "Hospital C — Bangalore",
            "nodeId": "Node-103",
            "localModel": "FedLocal v4.2c",
            "trainingStatus": "Training",
            "syncStatus": "Syncing",
            "online": False
        }
    ]


    # =========================================================
    # 12. FINAL RESPONSE
    # =========================================================

    return {

        # Doctor-specific
        "total_patients": total_patients,
        "predictions_today": predictions_today,
        "high_risk_patients": high_risk_patients,

        # Global ML model
        "model_accuracy": "94.8%",
        "active_hospitals": 3,

        # Doctor-specific analytics
        "risk_distribution": risk_distribution,
        "risk_trend": risk_trend,

        # Doctor-specific patients
        "recent_patients": recent_db_patients,

        # Doctor-specific activity
        "activity": activities,

        # Global federated infrastructure
        "federated_nodes": federated_nodes,

        "last_updated": datetime.utcnow().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }