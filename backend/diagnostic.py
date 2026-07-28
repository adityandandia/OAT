import sys

def check_package_versions():
    print("=" * 50)
    print("      ONETEST ENVIRONMENT DIAGNOSTIC TOOL      ")
    print("=" * 50)
    
    # Python Version
    print(f"\n[+] Python Executable: {sys.executable}")
    print(f"[+] Python Version:    {sys.version.split()[0]}")
    print("-" * 50)

    # Core Libraries Check
    libraries = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("sqlalchemy", "SQLAlchemy"),
        ("pyodbc", "PyODBC"),
        ("jwt", "PyJWT"),
        ("passlib", "Passlib"),
        ("pydantic", "Pydantic")
    ]

    print("Checking Library Versions:\n")
    for module_name, display_name in libraries:
        try:
            mod = __import__(module_name)
            version = getattr(mod, "__version__", "Installed (Version unknown)")
            print(f"  ✓ {display_name:<15}: {version}")
        except ImportError:
            print(f"  ✗ {display_name:<15}: NOT INSTALLED")

    print("-" * 50)

    # MS SQL ODBC Drivers Check
    try:
        import pyodbc
        drivers = pyodbc.drivers()
        print("Installed ODBC Drivers (for MS SQL Server):")
        ms_sql_drivers = [d for d in drivers if 'SQL Server' in d]
        
        if ms_sql_drivers:
            for driver in ms_sql_drivers:
                print(f"  • {driver}")
        else:
            print("  ⚠️ No MS SQL Server ODBC drivers found!")
            print("     (Install 'ODBC Driver 17 or 18 for SQL Server' from Microsoft)")
    except ImportError:
        print("Could not check ODBC drivers because 'pyodbc' is not installed.")

    print("=" * 50)

if __name__ == "__main__":
    check_package_versions()