import Tasks from "./models/TaskSchema.js";
import Reminder from "./models/ReminderSchema.js";
import Persons from "./models/PersonSchema.js";

export function setTimes(app) {

    app.post("/setTimes", async (req, res) => {
        const { name, content, startTime, personIds } = req.body;


        const [hour, minute] = startTime.split(":").map(Number);


        const taskCounts = Array.isArray(personIds)
            ? personIds.map(id => ({ personId: id, count: 0 }))
            : personIds
            ? [{ personId: personIds, count: 0 }]
            : [];

        try {
            await Reminder.create({
                name,
                content,
                hour,
                minute,
                taskCounts
            });
            res.redirect("/reminder");
        } catch (err) {
            console.error(err);
            res.status(500).send("Fehler beim Speichern");
        }
    });
    app.get("/reminder", async (req, res) => {
        try {
            const reminders = await Reminder.find()
                .populate("taskCounts.personId")
                .sort({ hour: 1, minute: 1 });

            const persons = await Persons.find().sort({ person: 1 });

            res.render("reminder", { reminders, persons });
        } catch (err) {
            console.error(err);
            res.status(500).send("Fehler beim Laden");
        }
    });
    app.get("/reminder/edit/:id", async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id)
            .populate("taskCounts.personId");

        const persons = await Persons.find().sort({ person: 1 });

        res.render("editReminder", { reminder, persons });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Laden");
    }
});
app.post("/reminder/update/:id", async (req, res) => {
    const { name, content, startTime } = req.body;

    let { personIds, counts } = req.body;

    const [hour, minute] = startTime.split(":").map(Number);


    if (!personIds) {
        personIds = [];
    } else if (!Array.isArray(personIds)) {
        personIds = [personIds];
    }

    if (!counts) {
        counts = [];
    } else if (!Array.isArray(counts)) {
        counts = [counts];
    }

    const taskCounts = personIds.map((id, index) => ({
        personId: id,
        count: counts[index] ? Number(counts[index]) : 0
    }));

    try {
        // 1️⃣ Reminder aktualisieren
        const updatedReminder = await Reminder.findByIdAndUpdate(
    req.params.id,
    { name, content, hour, minute, taskCounts },
    { returnDocument: 'after' }
);

        if (updatedReminder) {
            await Tasks.updateMany(
                { type: updatedReminder.name },
                {
                    hour: updatedReminder.hour,
                    minute: updatedReminder.minute,
                    content: updatedReminder.content
                }
            );
        }

        res.redirect("/reminder");
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Aktualisieren");
    }
});
app.post("/reminder/delete/:id", async (req, res) => {
    try {
        await Reminder.findByIdAndDelete(req.params.id);
        res.redirect("/reminder");
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Löschen");
    }
});
}
