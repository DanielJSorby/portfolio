@echo off
timeout /t 1 >nul

:: Åpne 100 terminalvinduer og kjøre curl parrot.live
for /l %%i in (1,1,100) do (
    start cmd /k curl parrot.live
    timeout /t 1 >nul
)

:: Opprett filen og skriv "Daniel var her" 30 ganger
set "file=DanielVarHer.lol"
echo Daniel var her > %file%
for /l %%i in (1,1,29) do echo Daniel var her >> %file%

:: Rydde skjermen og vise filen
cls
type %file%

pause