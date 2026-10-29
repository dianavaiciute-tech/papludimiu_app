const mongoose = require("mongoose");

const stebejimasSchema = new mongoose.Schema({
  papludimys: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Papludimys",
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },

  vandensTemperatura: {
    type: Number,
    required: [true, "Būtina įvesti vandens temperatūrą"],
    min: [0, "Temperatūra negali būti mažesnė nei 0 °C"],
    max: [45, "Temperatūra negali būti didesnė nei 45 °C"],
  },

  vandensKokybe: {
    type: String,
    required: true,
    enum: ["Puiki", "Gera", "Bloga"],
  },
  bangavimas: {
    type: String,
    required: true,
    enum: ["Žalia", "Geltona", "Raudona"],
  },
  pastabos: {
    type: String,
  },
});

module.exports = mongoose.model("Stebejimas", stebejimasSchema);
