@echo off
REM Simple batch script to run migrations using psql
REM Usage: run-migrations-simple-psql.bat "postgresql://postgres:password@host:port/dbname"

if "%1"=="" (
    echo.
    echo ======================================================================
    echo ERROR: Missing database connection string!
    echo ======================================================================
    echo.
    echo Usage: run-migrations-simple-psql.bat "postgresql://postgres:password@host:port/dbname"
    echo.
    echo To get your connection string:
    echo 1. Go to: https://app.supabase.com/project/orokrcisrptwteoqijbs
    echo 2. Settings ^> Database ^> Connection string
    echo 3. Copy the "Direct connection" string
    echo.
    pause
    exit /b 1
)

set CONNECTION_STRING=%1

echo.
echo ======================================================================
echo Running Database Migrations
echo ======================================================================
echo.

echo [1/3] Running 001_initial_schema.sql...
psql "%CONNECTION_STRING%" -f "supabase\migrations\001_initial_schema.sql"
if errorlevel 1 (
    echo ERROR: Migration 1 failed!
    pause
    exit /b 1
)
echo ✓ Success!

echo.
echo [2/3] Running 002_rls_policies.sql...
psql "%CONNECTION_STRING%" -f "supabase\migrations\002_rls_policies.sql"
if errorlevel 1 (
    echo ERROR: Migration 2 failed!
    pause
    exit /b 1
)
echo ✓ Success!

echo.
echo [3/3] Running 003_functions_and_triggers.sql...
psql "%CONNECTION_STRING%" -f "supabase\migrations\003_functions_and_triggers.sql"
if errorlevel 1 (
    echo ERROR: Migration 3 failed!
    pause
    exit /b 1
)
echo ✓ Success!

echo.
echo ======================================================================
echo All migrations completed successfully!
echo ======================================================================
echo.
echo Verify in Supabase Dashboard ^> Table Editor
echo You should see 11 tables created.
echo.
pause

