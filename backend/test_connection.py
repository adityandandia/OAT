import os
from sqlalchemy import create_engine, text
import urllib

SERVER = "localhost"
DATABASE = "OneTestDB"
USER = "sa"
# Replace this string with your actual 'sa' password used when setting up SSMS
PASSWORD = "Onetest@2026"

SAFE_PASSWORD = urllib.parse.quote_plus(PASSWORD)
# SQL Server Authentication connection string
DATABASE_URL = (
    f"mssql+pyodbc://{USER}:{SAFE_PASSWORD}@{SERVER}/{DATABASE}"
    "?driver=ODBC+Driver+18+for+SQL+Server"
    "&TrustServerCertificate=yes"
)

print(f"Connecting to {DATABASE} on {SERVER} as '{USER}'...")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT DB_NAME();"))
        db_name = result.scalar()
        print(f"✓ SUCCESS! Connected to database: {db_name}")
except Exception as e:
    print("✗ CONNECTION FAILED:")
    print(e)