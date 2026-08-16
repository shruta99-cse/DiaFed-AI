from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime


# =========================================================
# USER SCHEMAS
# =========================================================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class Token(BaseModel):
    access_token: str
    token_type: str


# =========================================================
# PATIENT SCHEMAS
# =========================================================

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: Optional[str] = "Female"

    glucose: float
    blood_pressure: float
    skin_thickness: Optional[float] = 20.0
    insulin: Optional[float] = 80.0
    bmi: float
    dpf: Optional[float] = 0.47
    pregnancies: Optional[int] = 0


class PatientResponse(BaseModel):
    id: int
    name: str
    age: int
    gender: str

    glucose: float
    blood_pressure: float
    bmi: float

    risk_level: str
    prediction: str
    confidence: float

    created_at: datetime

    class Config:
        from_attributes = True


# =========================================================
# PREDICTION INPUT
# =========================================================

class PredictionInput(BaseModel):
    patient_name: str

    age: int
    gender: Optional[str] = "Female"

    glucose: float
    blood_pressure: float

    skin_thickness: Optional[float] = 20.0
    insulin: Optional[float] = 85.0

    bmi: float

    dpf: Optional[float] = 0.47
    pregnancies: Optional[int] = 0


# =========================================================
# SHAP FEATURE IMPORTANCE
# =========================================================

class FeatureImportance(BaseModel):
    feature: str

    value: Optional[float] = None

    shap_value: Optional[float] = None

    val: str = ""

    impact: str

    direction: str = "neutral"


# =========================================================
# PREDICTION OUTPUT
# =========================================================

class PredictionOutput(BaseModel):
    id: Optional[int] = None

    patient_name: str
    age: int

    glucose: float
    bmi: float

    risk_level: str
    prediction: str

    probability: float
    confidence: float

    shap_explanation: List[FeatureImportance]

    created_at: datetime


# =========================================================
# DASHBOARD RISK DISTRIBUTION
# =========================================================

class RiskDistributionItem(BaseModel):
    name: str
    value: int
    count: int
    color: str


# =========================================================
# DASHBOARD RISK TREND
# =========================================================

class RiskTrendItem(BaseModel):
    label: str
    risk: int
    avg: float


class RiskTrend(BaseModel):
    daily: List[RiskTrendItem]
    weekly: List[RiskTrendItem]


# =========================================================
# FEDERATED LEARNING NODE
# =========================================================

class HospitalNode(BaseModel):
    name: str
    nodeId: str
    localModel: str
    trainingStatus: str
    syncStatus: str
    online: bool


# =========================================================
# DASHBOARD
# =========================================================

class DashboardSummary(BaseModel):

    # -----------------------------------------------------
    # Doctor-specific
    # -----------------------------------------------------

    total_patients: int

    predictions_today: int

    high_risk_patients: int

    risk_distribution: List[RiskDistributionItem]

    risk_trend: RiskTrend

    recent_patients: List[PatientResponse]

    activity: List[Any]


    # -----------------------------------------------------
    # Global federated model
    # -----------------------------------------------------

    model_accuracy: str

    active_hospitals: int

    federated_nodes: List[HospitalNode]


    # -----------------------------------------------------
    # Timestamp
    # -----------------------------------------------------

    last_updated: str