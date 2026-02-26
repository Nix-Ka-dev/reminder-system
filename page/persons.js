import Persons from "./models/PersonSchema.js";

export function persons(app) {

    app.get("/persons", async (req, res) => {
        try {
            const personsList = await Persons.find().sort({ person: 1 });
            res.render("persons", { persons: personsList });
        } catch (err) {
            console.error(err);
            res.status(500).send("Fehler beim Laden der Personen");
        }
    });

    // Neue Person speichern
    app.post("/persons", async (req, res) => {
        const { person, discordId } = req.body;

        try {
            const newPerson = new Persons({
                person,
                discordId,
                taskIndex: 0
            });

            await newPerson.save();
            res.redirect("/persons");

        } catch (err) {
            console.error("Fehler beim Speichern:", err);
            res.status(500).send("Fehler beim Speichern");
        }
    });
    app.get("/persons/edit/:id", async (req, res) => {
    try {
        const person = await Persons.findById(req.params.id);
        if (!person) {
            return res.status(404).send("Person nicht gefunden");
        }
        res.render("editPerson", { person }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Laden der Person");
    }
});
app.post("/persons/update/:id", async (req, res) => {
    const { person, discordId } = req.body;

    try {
        await Persons.findByIdAndUpdate(
            req.params.id,
            { person, discordId },
            { returnDocument: 'after' } 
        );

        res.redirect("/persons");
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Aktualisieren der Person");
    }
});app.post("/persons/delete/:id", async (req, res) => {
    try {
        await Persons.findByIdAndDelete(req.params.id);
        res.redirect("/persons");
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Löschen der Person");
    }
});
}
