@echo off
setlocal
title CalCU by YouDO - Uninstaller
echo ============================================================================
echo   CalCU by YouDO - Uninstaller
echo ============================================================================
echo.

:: GateCalcOverlay.exe is the name used by early builds; removed here as well.

:: The installer builds CalCU.exe in its own folder, which may not be this one,
:: and the startup entry records where. Read it before the entry is removed,
:: and only ever delete a file named CalCU.exe, whatever the entry says.
set "INSTALLED_EXE="
for /f "tokens=2,*" %%A in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "CalCU" 2^>nul ^| findstr /c:"REG_SZ"') do set "INSTALLED_EXE=%%~B"
if defined INSTALLED_EXE for %%F in ("%INSTALLED_EXE%") do if /i not "%%~nxF"=="CalCU.exe" set "INSTALLED_EXE="

echo [1/3] Stopping CalCU...
taskkill /F /IM CalCU.exe >nul 2>&1
taskkill /F /IM GateCalcOverlay.exe >nul 2>&1

echo [2/3] Removing CalCU.exe and starting with Windows...
if defined INSTALLED_EXE call :DeleteWhenReleased "%INSTALLED_EXE%"
call :DeleteWhenReleased "%~dp0CalCU.exe"
call :DeleteWhenReleased "%~dp0GateCalcOverlay.exe"
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "CalCU" /f >nul 2>&1
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\CalCU.lnk" del /F /Q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\CalCU.lnk"

echo [3/3] Removing the per-user browser emulation registry value...
reg delete "HKCU\Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION" /v "CalCU.exe" /f >nul 2>&1
reg delete "HKCU\Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION" /v "GateCalcOverlay.exe" /f >nul 2>&1

echo.
echo ============================================================================
echo   Done. CalCU has been removed.
echo ============================================================================
pause
exit /b 0

:: Deletes the file if it exists. A program that was just stopped can keep its
:: file locked for a moment, so this tries again for up to 10 seconds.
:DeleteWhenReleased
for /l %%T in (1,1,10) do (
    if not exist "%~1" exit /b 0
    del /F /Q "%~1" >nul 2>&1
    if exist "%~1" ping -n 2 127.0.0.1 >nul
)
if exist "%~1" echo   Could not delete "%~1". Close CalCU and delete it by hand.
exit /b 0
