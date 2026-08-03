from typing import Optional
from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
import jwt

from database import get_db
from models import Employee
from security import decode_jwt_token

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Employee:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: Token missing")

    token = authorization.split(" ")[1]

    try:
        payload = decode_jwt_token(token)
        emp_id: int = payload.get("employee_id")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid token")

    user = db.query(Employee).filter(Employee.employee_id == emp_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized: User not found")

    return user