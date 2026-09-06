@echo off
title CrimeVision AI launcher
echo ===================================================
echo   Starting CrimeVision AI Server...
echo ===================================================
echo.

:: Open default browser to the website
start "" "http://127.0.0.1:5000"

:: Start the python Flask server
python app.py

pause
