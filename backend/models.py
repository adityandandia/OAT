from sqlalchemy import Column, Integer, String, DateTime
from database import Base

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