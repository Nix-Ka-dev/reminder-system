markdown
# Reminder System

**Ein Node.js-Projekt mit einer Verwaltungsseite für Dienste und Reminder-Nachrichten, das selbst gehostet werden kann.**

## Inhaltsverzeichnis

- [Setup](#setup)
- [Manuelles Starten](#manuelles-starten)
- [Verwendung von PM2](#verwendung-von-pm2)
- [Hinweise](#hinweise)

---

## Setup

### 1. Herunterladen des Projekts

Lade das gesamte Projekt herunter oder klone es mit:

```bash
git clone [Repository-URL]
cd reminder-system
```
2. Abhängigkeiten installieren

Installiere die benötigten Pakete:

bash
npm install

3. .env-Dateien erstellen

Erstelle zwei .env-Dateien, eine für die Verwaltungsseite und eine für den Discord-Bot.
a. .env für die Verwaltungsseite

Gehe in den page-Unterordner und erstelle die .env-Datei mit folgendem Inhalt:

plaintext
# Beispiel für Umgebungsvariablen
PORT=3000
DATABASE\_URI=mongodb://your\_database\_uri
# Füge hier weitere benötigte Umgebungsvariablen hinzu

b. .env für den Discord-Bot

Gehe in den Discord-Unterordner und erstelle die .env-Datei mit folgendem Inhalt:

plaintext
# Beispiel für Umgebungsvariablen
DISCORD\_TOKEN=your\_discord\_bot\_token
REMINDER\_CHANNEL\_ID=your\_channel\_id
# Füge hier weitere benötigte Umgebungsvariablen hinzu

Manuelles Starten
a. Verwaltungsseite

Wechsle in den Unterordner page und führe den folgenden Befehl aus:

bash
cd page
node index.js

b. Discord-Bot

Wechsle in den Unterordner Discord und starte den Bot:

bash
cd ../Discord
node index.js

Verwendung von PM2

PM2 ist ein mächtiges Tool zur Prozessverwaltung für Node.js-Anwendungen. Um PM2 zu verwenden, installiere es global:

bash
npm install -g pm2

a. Verwaltungsseite mit PM2 starten

Wechsle in den page-Unterordner und starte die Anwendung:

bash
cd page
pm2 start index.js --name "reminder-web"

b. Discord-Bot mit PM2 starten

Gehe in den Discord-Unterordner und starte den Bot:

bash
cd ../Discord
pm2 start index.js --name "reminder-bot"
