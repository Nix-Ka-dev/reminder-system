import cron from "node-cron";
import Tasks from "./models/TaskSchema.js";
import Persons from "./models/PersonSchema.js";
import Reminder from "./models/ReminderSchema.js";

export function reminder(client) {
  cron.schedule("30 * * * * *", async () => {
    const now = new Date();

    try {
      const today = now.toISOString().slice(0, 10);

      const tasks = await Tasks.find({
        date: today,
        hour: now.getHours(),
        minute: now.getMinutes()
      });

      const channelId = process.env.REMINDER_CHANNEL_ID;
      const channel = await client.channels.fetch(channelId);
      if (!channel) return;

      for (const task of tasks) {
        const person = await Persons.findOne({ person: task.person });

        if (person) {
          if (person.discordId) {
            // Check if discordId represents a role or user
            if (person.discordId.startsWith("ROLE_")) {
              // It's a role ID (replace ROLE_ with your actual prefix if needed)
              const role = channel.guild.roles.cache.get(person.discordId.slice(5));
              if (role) {
                await channel.send(`<@&${role.id}> ${task.content}`);
              } else {
                console.log(`Role not found: ${person.discordId}`);
              }
            } else {
              // Treat it as a user ID
              await channel.send(`<@${person.discordId}> ${task.content}`);
            }
          }
        } else {
          console.log("No person found for the task.");
        }

        if (task.type) {
          const reminder = await Reminder.findOne({ name: task.type });

          if (reminder) {
            const entry = reminder.taskCounts.find(tc =>
              tc.personId.toString() === person?._id.toString()
            );

            if (entry) {
              entry.count += 1;
              await reminder.save();
              console.log(`Count increased for ${person?.person}`);
            }
          }
        } else {
          console.log("No type specified.");
        }
      }

    } catch (err) {
      console.error("Error sending task reminders:", err);
    }
  });
}
