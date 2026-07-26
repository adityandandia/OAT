import os
import pyodbc
from dotenv import load_dotenv

# Load .env from the parent (database/) folder
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DB_SERVER = os.getenv("DB_SERVER")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT", "1433")

conn_str = (
    "DRIVER={SQL Server};"
    f"SERVER={DB_SERVER},{DB_PORT};"
    f"DATABASE={DB_NAME};"
    f"UID={DB_USER};"
    f"PWD={DB_PASSWORD};"
    "TrustServerCertificate=yes;"
)

try:
    conn = pyodbc.connect(conn_str, timeout=5)
    cursor = conn.cursor()
    cursor.execute("SELECT @@VERSION;")
    row = cursor.fetchone()
    print("✅ Connected successfully!")
    print(row[0])
    cursor.close()
    conn.close()
except Exception as e:
    print("❌ Connection failed:")
    print(e)