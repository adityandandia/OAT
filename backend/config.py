import os
import urllib.parse

SERVER = os.getenv("DB_SERVER", "localhost")
DATABASE = os.getenv("DB_NAME", "OneTestDB")
USER = os.getenv("DB_USER", "sa")
RAW_PASSWORD = os.getenv("DB_PASSWORD", "OneTest@2026")  # Put your exact sa password

SAFE_PASSWORD = urllib.parse.quote_plus(RAW_PASSWORD)

DATABASE_URL = (
    f"mssql+pyodbc://{USER}:{SAFE_PASSWORD}@{SERVER}/{DATABASE}"
    "?driver=ODBC+Driver+18+for+SQL+Server"
    "&TrustServerCertificate=yes"
)

SECRET_KEY = os.getenv("JWT_SECRET", "onetest_secret_key_change_in_production")
ALGORITHM = "HS256"