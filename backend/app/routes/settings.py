from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.auth import get_current_user
from app.schemas import UserProfileUpdate, UserResponse

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("/profile", response_model=UserResponse)
def get_settings_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_settings_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.name:
        current_user.name = profile_data.name
    if profile_data.email and profile_data.email != current_user.email:
        current_user.email = profile_data.email

    db.commit()
    db.refresh(current_user)
    return current_user
