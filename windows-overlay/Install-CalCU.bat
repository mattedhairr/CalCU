@echo off
setlocal
title CalCU - a YouDO Tool - Installer

:: The CalCU website rewrites this line for custom downloads.
set "HOTKEY=Alt+C"

echo ============================================================================
echo   CalCU - a YouDO Tool
echo   GATE virtual calculator overlay. Shortcut: %HOTKEY%
echo ============================================================================
echo.

:: Stop a running copy so CalCU.exe can be replaced. GateCalcOverlay.exe is the
:: name used by early builds; it would otherwise keep holding the shortcut.
taskkill /F /IM CalCU.exe >nul 2>&1
taskkill /F /IM GateCalcOverlay.exe >nul 2>&1

set "CSC=%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC%" set "CSC=%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe"
if not exist "%CSC%" (
    echo [ERROR] The .NET Framework 4 C# compiler was not found on this PC.
    pause
    exit /b 1
)

:: Where the C# source comes from:
::  - single-file download from the website: appended after the marker line at
::    the end of this file, found by searching for the marker, so the line
::    number never has to be maintained by hand
::  - GitHub repo or release zip: CalCU.cs next to this file
set "SRC=%TEMP%\CalCU-%RANDOM%.cs"
for /f "usebackq delims=:" %%N in (`findstr /n /b /c:"::CALCU-CSHARP-BELOW" "%~f0"`) do set "SKIP=%%N"
more +%SKIP% "%~f0" > "%SRC%"
findstr /c:"namespace CalCU" "%SRC%" >nul 2>&1
if errorlevel 1 (
    if not exist "%~dp0CalCU.cs" (
        echo [ERROR] CalCU.cs was not found next to Install-CalCU.bat.
        del "%SRC%" >nul 2>&1
        pause
        exit /b 1
    )
    copy /y "%~dp0CalCU.cs" "%SRC%" >nul
)

echo [1/2] Building CalCU.exe with the C# compiler built into Windows...
"%CSC%" /nologo /target:winexe /out:"%~dp0CalCU.exe" "%SRC%"
set "BUILD_RESULT=%ERRORLEVEL%"
del "%SRC%" >nul 2>&1
if not "%BUILD_RESULT%"=="0" (
    echo.
    echo [ERROR] CalCU.exe could not be built. Make sure .NET Framework 4 is enabled.
    pause
    exit /b 1
)

echo [2/2] Starting CalCU.exe...
start "" "%~dp0CalCU.exe"
echo.
echo   HOW TO USE
echo   - Press %HOTKEY% anywhere on Windows to show / hide the calculator.
echo   - Right-click the CalCU tray icon near the clock to exit.
echo   - Run Uninstall-CalCU.bat to remove it.
echo.
pause
exit /b 0
::CALCU-CSHARP-BELOW
