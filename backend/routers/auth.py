from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from models import Employee
from schemas import LoginRequest, LoginResponse, UserResponse
from security import create_jwt_token
from dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    identifier = payload.identifier.strip()
    password = payload.password.strip()

    if not identifier or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID/Username and password are required"
        )

    user = db.query(Employee).filter(
        or_(
            Employee.username == identifier,
            Employee.employee_id == (int(identifier) if identifier.isdigit() else -1)
        )
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.password_hash != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.role not in ["Learner", "Creator", "Admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to access OneTest")

    token = create_jwt_token({
        "employee_id": user.employee_id,
        "role": user.role
    })

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "employee_id": user.employee_id,
            "name": user.name,
            "username": user.username,
            "department": user.department,
            "role": user.role
        }
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_route(user: Employee = Depends(get_current_user)):
    return {
        "employee_id": user.employee_id,
        "name": user.name,
        "username": user.username,
        "department": user.department,
        "role": user.role
    }