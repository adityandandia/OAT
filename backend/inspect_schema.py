from sqlalchemy import create_engine, inspect

SERVER = "localhost"
DATABASE = "OneTestDB"
DATABASE_URL = (
    f"mssql+pyodbc://@{SERVER}/{DATABASE}"
    "?driver=ODBC+Driver+18+for+SQL+Server"
    "&trusted_connection=yes"
    "&TrustServerCertificate=yes"
)

engine = create_engine(DATABASE_URL)
inspector = inspect(engine)

print("Columns in 'dbo.Employee':\n" + "-"*35)
try:
    columns = inspector.get_columns("Employee", schema="dbo")
    for col in columns:
        print(f"  • {col['name']:<20} ({col['type']})")
except Exception as e:
    print("Error fetching table schema:", e)