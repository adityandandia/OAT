from typing import Optional
from pydantic import BaseModel

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