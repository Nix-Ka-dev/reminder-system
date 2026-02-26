import Tasks from "./models/TaskSchema.js";
import Reminder from "./models/ReminderSchema.js";
import Persons from "./models/PersonSchema.js";
export function tasks(app) {
    app.post("/tasks", async (req, res) => {
        const { date, person, type, clock, content } = req.body;

        try {
            const taskData = {
                date,
                person
            };

            if (type && type.trim() !== '') {
                const reminder = await Reminder.findOne({ name: type });


                if (reminder) {
                    taskData.hour = reminder.hour;
                    taskData.minute = reminder.minute;
                    taskData.content = reminder.content;
                }

                taskData.type = type; 
            } else {
                const [hour, minute] = clock.split(':').map(Number);
                taskData.hour = hour;
                taskData.minute = minute;
                taskData.content = content;
            }

            const newTask = new Tasks(taskData);
            await newTask.save();
            res.redirect("/tasks");

        } catch (error) {
            console.error("Fehler beim Speichern der Aufgabe:", error);
            res.status(500).send("Fehler beim Speichern der Aufgabe");
        }
    });

    app.get("/tasks", async (req, res) => {
        try {
            const tasksList = await Tasks.find();
            const reminders = await Reminder.find().sort({ name: 1 });
            const persons = await Persons.find().sort({ person: 1 });
            res.render("tasks", { tasks: tasksList, reminders, persons });
        } catch (err) {
            console.error(err);
            res.status(500).send("Fehler beim Laden der Aufgaben");
        }
    });
    app.post("/tasks/delete/:id", async (req, res) => {
    try {
        await Tasks.findByIdAndDelete(req.params.id);
        res.redirect("/tasks");
    } catch (err) {
        console.error("Fehler beim Löschen:", err);
        res.status(500).send("Fehler beim Löschen");
    }
});
app.get("/tasks/edit/:id", async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.id);
        const reminders = await Reminder.find().sort({ name: 1 });
        const persons = await Persons.find().sort({ person: 1 });

        res.render("editTask", { task, reminders, persons });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Laden");
    }
});
app.post("/tasks/update/:id", async (req, res) => {
    try {
        const { date, person, type, clock, content } = req.body;

        const updateData = {
            date,
            person
        };

        if (type && type.trim() !== '') {
            const reminder = await Reminder.findOne({ name: type });

            if (reminder) {
                updateData.hour = reminder.hour;
                updateData.minute = reminder.minute;
                updateData.content = reminder.content;
            }

            updateData.type = type;
        } else {
            const [hour, minute] = clock.split(':').map(Number);
            updateData.hour = hour;
            updateData.minute = minute;
            updateData.content = content;
            updateData.type = null;
        }

        await Tasks.findByIdAndUpdate(req.params.id, updateData);

        res.redirect("/tasks");
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Aktualisieren");
    }
});

}
