@echo off
setlocal
title CalCU by YouDO - Installer

:: The CalCU website rewrites this line for custom downloads.
set "HOTKEY=Alt+C"

echo ============================================================================
echo   CalCU by YouDO
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

:: An earlier install may be in another folder, which the startup entry records.
:: Remove that CalCU.exe (only ever a file named CalCU.exe, whatever the entry
:: says) and the one here, so this install is the only copy left. The build
:: below always puts a fresh CalCU.exe here. Older setups may also have started
:: CalCU from a Startup-folder shortcut, which would start a second copy.
echo [1/4] Removing any earlier CalCU...
set "OLD_EXE="
for /f "tokens=2,*" %%A in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "CalCU" 2^>nul ^| findstr /c:"REG_SZ"') do set "OLD_EXE=%%~B"
if defined OLD_EXE for %%F in ("%OLD_EXE%") do if /i not "%%~nxF"=="CalCU.exe" set "OLD_EXE="
if defined OLD_EXE call :DeleteWhenReleased "%OLD_EXE%"
call :DeleteWhenReleased "%~dp0CalCU.exe"
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\CalCU.lnk" del /F /Q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\CalCU.lnk"

echo [2/4] Building CalCU.exe with the C# compiler built into Windows...
"%CSC%" /nologo /target:winexe /out:"%~dp0CalCU.exe" "%SRC%"
set "BUILD_RESULT=%ERRORLEVEL%"
del "%SRC%" >nul 2>&1
if not "%BUILD_RESULT%"=="0" (
    echo.
    echo [ERROR] CalCU.exe could not be built. Make sure .NET Framework 4 is enabled.
    pause
    exit /b 1
)

:: Per-user startup entry (no admin rights needed). It points at this folder,
:: so moving the folder means running the installer again.
echo [3/4] Setting CalCU to start with Windows...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "CalCU" /t REG_SZ /d "\"%~dp0CalCU.exe\"" /f >nul

:: /show opens the calculator once so you can see it works. After a restart
:: CalCU starts hidden and waits for the shortcut.
echo [4/4] Starting CalCU.exe...
start "" "%~dp0CalCU.exe" /show
echo.
echo   HOW TO USE
echo   - Press %HOTKEY% anywhere on Windows to show / hide the calculator.
echo   - CalCU now starts with Windows, hidden until you press %HOTKEY%.
echo     Turn that off in Task Manager - Startup apps.
echo   - Right-click the CalCU tray icon near the clock to exit.
echo   - Run Uninstall-CalCU.bat to remove it.
echo.
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
::CALCU-CSHARP-BELOW
