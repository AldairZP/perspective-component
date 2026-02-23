@echo off
echo Building the Ignition Module using Docker...
docker compose up builder
echo.
echo Build complete! Check the "build" folder for your .modl file.
pause
