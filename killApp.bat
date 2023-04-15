@echo off
echo Closing all Command Prompt, PowerShell, and Windows Terminal windows...

for /f "tokens=2" %%a in ('tasklist /nh /fi "imagename eq cmd.exe"') do (
    echo Closing cmd.exe with PID %%a...
    taskkill /f /pid %%a
)

for /f "tokens=2" %%a in ('tasklist /nh /fi "imagename eq powershell.exe"') do (
    echo Closing powershell.exe with PID %%a...
    taskkill /f /pid %%a
)

for /f "tokens=2" %%a in ('tasklist /nh /fi "imagename eq pwsh.exe"') do (
    echo Closing pwsh.exe (PowerShell Core) with PID %%a...
    taskkill /f /pid %%a
)

for /f "tokens=2" %%a in ('tasklist /nh /fi "imagename eq WindowsTerminal.exe"') do (
    echo Closing WindowsTerminal.exe with PID %%a...
    taskkill /f /pid %%a
)

echo All matching windows and apps have been closed.