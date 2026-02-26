import Tasks from "./models/TaskSchema.js";
import Reminder from "./models/ReminderSchema.js";

export function generator(app) {

    app.post("/tasks/generate", async (req, res) => {
        const { startDate, endDate, type } = req.body;

        let selectedDays = req.body.days || [];

        try {
            if (!startDate || !endDate || !type) {
                return res.status(400).send("Startdatum, Enddatum und Typ erforderlich");
            }

            if (!Array.isArray(selectedDays)) {
                selectedDays = [selectedDays];
            }

            // Strings → Numbers
            selectedDays = selectedDays.map(Number);

            const reminder = await Reminder.findOne({ name: type })
                .populate("taskCounts.personId");

            if (!reminder) {
                return res.status(404).send("Reminder nicht gefunden");
            }

            if (!reminder.taskCounts || reminder.taskCounts.length === 0) {
                return res.status(400).send("Keine Personen im Reminder hinterlegt");
            }

            const tempCounts = reminder.taskCounts.map(entry => ({
                personId: entry.personId,
                count: entry.count
            }));

            let currentDate = new Date(startDate);
            const lastDate = new Date(endDate);

            while (currentDate <= lastDate) {

                const dayOfWeek = currentDate.getDay();

                if (selectedDays.length === 0 || selectedDays.includes(dayOfWeek)) {

                    let selectedEntry = tempCounts[0];

                    for (let entry of tempCounts) {
                        if (entry.count < selectedEntry.count) {
                            selectedEntry = entry;
                        }
                    }

                    const selectedPerson = selectedEntry.personId;

                    await new Tasks({
                        date: new Date(currentDate),
                        type,
                        person: selectedPerson.person,
                        hour: reminder.hour,
                        minute: reminder.minute,
                        content: reminder.content
                    }).save();

                    selectedEntry.count += 1;
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            res.redirect("/tasks");

        } catch (error) {
            console.error("Generator Fehler:", error);
            res.status(500).send("Fehler beim Generieren");
        }
    });

}
