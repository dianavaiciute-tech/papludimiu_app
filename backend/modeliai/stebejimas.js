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
    required: true,
  },
  vandensKokybe: {
    type: String,
    required: true,
    enum: ["Puiki", "Gera", "Bloga"],
  },
  bangavimas: {
    type: String,
    required: true,
    enum: ["Zalia", "Geltona", "Raudona"],
  },
  pastabos: {
    type: String,
  },
});

module.exports = mongoose.model("Stebejimas", stebejimasSchema);
