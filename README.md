Shoutouts an simple css https://simplecss.org/ es wird für die verwaltungsseite genutzt
# Reminder System

**Ein Node.js-Projekt mit einer Verwaltungsseite für Dienste und Discord Reminder-Nachrichten, das selbst gehostet werden kann.**

## Inhaltsverzeichnis

- [Setup](#Setup)
- [Manuelles Starten](#manuelles-starten)
- [Verwendung von PM2 (empfohlen)](#nutze-pm2-zum-start)

---

## Setup

### 1. Herunterladen des Projekts

Lade das gesamte Projekt herunter oder klone es mit:

```bash
git clone [Repository-URL]
cd reminder-system
```

Lade node.js herunter
```bash
sudo apt install nodejs
```

2. .env-Dateien erstellen

Erstelle zwei .env-Dateien, eine für die Verwaltungsseite und eine für den Discord-Bot.
a. .env für die Verwaltungsseite

Gehe in den page-Unterordner und erstelle die .env-Datei mit folgendem Inhalt:

a. .env für die Page
```
MONGO_URI=mongodb://MONGODB-IP:PORT/verwaltung
LOGIN_PASSWORD=IHR_PASSWORT
SESSION_SECRET=IHR_SECRET
```
Gehe in den Discord-Unterordner und erstelle die .env-Datei mit folgendem Inhalt:

b. .env für den Discord-Bot
```
MONGO_URI=mongodb://MONGODB-IP:PORT/verwaltung
BOT_TOKEN=IHR_BOT_TOKEN
GUILD_ID=IHRE_SERVER_ID
CLIENT_ID=IHRE_CLIENT_ID
REMINDER_CHANNEL_ID=IHR_CHANNEL_FÜR_REMINDER
```
## Manuelles Starten
a. Verwaltungsseite
Wechsle in den Unterordner page und führe den folgenden Befehl aus:
```bash
node index.js
```

b. Discord-Bot
Wechsle in den Unterordner discord und starte den Bot:
```bash
node index.js
```
## Nutze PM2 zum start

PM2 ist ein mächtiges Tool zur Prozessverwaltung für Node.js-Anwendungen. Um PM2 zu verwenden, installiere es global:
```bash
npm install -g pm2
```

a. Verwaltungsseite mit PM2 starten

Wechsle in den page-Unterordner und starte die Anwendung:
```bash
pm2 start index.js --name "reminder-web"
```
b. Discord-Bot mit PM2 starten

Gehe in den Discord-Unterordner und starte den Bot:
```bash
pm2 start index.js --name "reminder-bot"
```
