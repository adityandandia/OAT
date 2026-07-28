import os
import urllib.parse
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, or_
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import jwt

# ==========================================
# CONFIGURATION & DATABASE CONNECTION
# ==========================================
SERVER = os.getenv("DB_SERVER", "localhost")
DATABASE = os.getenv("DB_NAME", "OneTestDB")
USER = os.getenv("DB_USER", "sa")
RAW_PASSWORD = os.getenv("DB_PASSWORD", "OneTest@2026") # Put your exact sa password

SAFE_PASSWORD = urllib.parse.quote_plus(RAW_PASSWORD)

DATABASE_URL = (
    f"mssql+pyodbc://{USER}:{SAFE_PASSWORD}@{SERVER}/{DATABASE}"
    "?driver=ODBC+Driver+18+for+SQL+Server"
    "&TrustServerCertificate=yes"
)

SECRET_KEY = os.getenv("JWT_SECRET", "onetest_secret_key_change_in_production")
ALGORITHM = "HS256"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(title="OneTest Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# SQLALCHEMY MODEL (Matches SSMS Schema)
# ==========================================
class Employee(Base):
    __tablename__ = "Employee"
    __table_args__ = {"schema": "dbo"}

    employee_id = Column("EmployeeID", Integer, primary_key=True, index=True)
    name = Column("Name", String(100), nullable=False)
    department = Column("Department", String(50))
    role = Column("Role", String(50), nullable=False)
    username = Column("Username", String(100), unique=True, nullable=False)
    password_hash = Column("PasswordHash", String(255), nullable=False)
    created_at = Column("CreatedAt", DateTime)


# ==========================================
# SCHEMAS
# ==========================================
class LoginRequest(BaseModel):
    identifier: str  # Can be EmployeeID or Username
    password: str

class UserResponse(BaseModel):
    employee_id: int
    name: str
    username: str
    department: Optional[str]
    role: str

class LoginResponse(BaseModel):
    message: str
    token: str
    user: UserResponse


def create_jwt_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=2)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ==========================================
# ENDPOINTS (Checkpoint 4 & 5)
# ==========================================
@app.get("/")
def read_root():
    return {"message": "OneTest Backend API is running successfully!"}

@app.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    identifier = payload.identifier.strip()
    password = payload.password.strip()

    if not identifier or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID/Username and password are required"
        )

    # Allow matching either Username or EmployeeID
    user = db.query(Employee).filter(
        or_(
            Employee.username == identifier,
            Employee.employee_id == (int(identifier) if identifier.isdigit() else -1)
        )
    ).first()

    # 1. Check if user exists
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 2. Check password (direct match or bcrypt hash)
    if user.password_hash != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 3. Role check (Learner, Creator, Admin)
    if user.role not in ["Learner", "Creator", "Admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to access OneTest")

    # 4. Generate JWT Token
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


@app.get("/auth/me", response_model=UserResponse)
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: Token missing")

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        emp_id: int = payload.get("employee_id")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid token")

    user = db.query(Employee).filter(Employee.employee_id == emp_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized: User not found")

    return {
        "employee_id": user.employee_id,
        "name": user.name,
        "username": user.username,
        "department": user.department,
        "role": user.role
    }