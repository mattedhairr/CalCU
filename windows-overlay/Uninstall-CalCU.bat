@echo off
setlocal
title CalCU - a YouDO Tool - Uninstaller
echo ============================================================================
echo   CalCU - a YouDO Tool - Uninstaller
echo ============================================================================
echo.

:: GateCalcOverlay.exe is the name used by early builds; removed here as well.

echo [1/3] Stopping CalCU...
taskkill /F /IM CalCU.exe >nul 2>&1
taskkill /F /IM GateCalcOverlay.exe >nul 2>&1

echo [2/3] Removing CalCU.exe and the Startup shortcut...
if exist "%~dp0CalCU.exe" del /F /Q "%~dp0CalCU.exe"
if exist "%~dp0GateCalcOverlay.exe" del /F /Q "%~dp0GateCalcOverlay.exe"
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\CalCU.lnk" del /F /Q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\CalCU.lnk"

echo [3/3] Removing the per-user browser emulation registry value...
reg delete "HKCU\Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION" /v "CalCU.exe" /f >nul 2>&1
reg delete "HKCU\Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION" /v "GateCalcOverlay.exe" /f >nul 2>&1

echo.
echo ============================================================================
echo   Done. CalCU has been removed.
echo ============================================================================
pause
