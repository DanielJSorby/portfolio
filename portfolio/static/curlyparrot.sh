#!/bin/bash

# Vent litt for å gi brukeren tid til å se hva som skjer
sleep 1

# Åpne Terminal (Mac)
osascript -e 'tell application "Terminal" to activate'

# Kjør curl parrot.live i 100 faner
for i in {1..100}; do
  osascript -e 'tell application "Terminal" to do script "curl parrot.live"'
  sleep 0.5
done

# Lag en fil og skriv "Daniel var her" 30 ganger
touch ~/DanielVarHer.lol
for i in {1..30}; do
  echo "Daniel var her" >> ~/DanielVarHer.lol
done

# Rydde skjermen og vise filen
clear
cat ~/DanielVarHer.lol