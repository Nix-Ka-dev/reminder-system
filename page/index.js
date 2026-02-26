import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { setTimes } from "./setTimes.js";
import { tasks } from "./tasks.js";
import { persons } from "./persons.js";
import { generator } from "./generator.js";
import session from "express-session";

dotenv.config();

//app steht ab jetzt für die express anwendung
const app = express();
//der listening port 3000 sind die meisten node.js andwendungen
const port = 3000;
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 1000 * 60 * 30 // 30 Minuten
  }
}));



//die view engine wird festgelegt mit dem verzeichnis der dateien
app.set("view engine", "ejs");
app.set("views", "./views");

//MongoDB versucht sich mit der in der env angebenen datenbank zu verbinden
mongoose.connect(process.env.MONGO_URI);

//wenn die verbindung klappt wird eine nachricht in der konsole ausgegeben
mongoose.connection.once("open", () => {
  console.log("MongoDB verbunden");
});
function requireAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect("/login");
}

app.get("/", (req, res) => {
  res.redirect("/tasks");
});
app.get("/settings", (req, res) => {
  res.render("settings");
});
// Login Seite
app.get("/login", (req, res) => {
  res.render("login");
});

// Login Verarbeitung
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (password === process.env.LOGIN_PASSWORD) {
    req.session.isAuthenticated = true;
    return res.redirect("/tasks");
  }

  res.render("login", { error: "Falsches Passwort" });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.use(requireAuth);

setTimes(app);
tasks(app);
persons(app);
generator(app);



app.listen(port, () => {
  console.log(`Server läuft auf: Port ${port}`);
});