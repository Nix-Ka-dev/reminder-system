
import { Client, GatewayIntentBits, ActivityType, Collection, Events } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import { reminder } from "./reminder.js";


dotenv.config();

//Die Intents des Discord Bots werden hier definiert, in diesem Fall nur die Guilds Intents, da der Bot nur auf Servern aktiv sein soll
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

//MongoDB mit der URI aus der .env Datei verbinden
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

//Die Directory für die Commands wird ausgelesen und die Commands werden dem Client hinzugefügt
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.default.name, command.default);
}

//Command Interaction werden gehandhabt und die entsprechenden Command Dateien ausgeführt
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (err) {
        console.error(err);
        await interaction.reply({
            content: "❌ Fehler beim Ausführen des Commands.",
            ephemeral: true,
        });
    }
});
//Die Events werden ausgeführt wenn der Bot startet
client.once(Events.ClientReady, async c => {
    console.log(`Logged in as ${c.user.tag}`);
    //Den Status des Bots setzen
    c.user.setPresence({
        status: "online",
        activities: [{ name: "🗒️ Dienstpläne", type: ActivityType.Watching }],
    });
    //Die Reminder function aus der reminder.js Datei wird hier aufgerufen, damit die Erinnerungen gesendet werden können
    reminder(client);
});

//Den Bot mit dem Token aus der .env Datei einloggen
client.login(process.env.BOT_TOKEN);