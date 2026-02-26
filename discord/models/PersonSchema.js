import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  discordId: String,
  person: String
});

export default mongoose.model("Persons", personSchema);