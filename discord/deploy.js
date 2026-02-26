import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const DISCORD_BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
  {
    name: "next",
    description: "Zeigt deinen nächsten Dienst an.",
    options: [
    {
      name: "person",
      type: 6,
      description: "Optional: Anderen Benutzer anzeigen",
      required: false,
    },
  ]
  }
];

const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log("Registriere Slash-Befehle...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("Slash-Befehle erfolgreich registriert!");
  } catch (err) {
    console.error(err);
  }
})();
