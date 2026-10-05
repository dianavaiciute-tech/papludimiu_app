const mongoose = require("mongoose");

const papludimysSchema = new mongoose.Schema({
  pavadinimas: {
    type: String,
    required: true,
  },
  miestas: {
    type: String,
    required: true,
  },
  platuma: {
    type: Number,
    required: true,
  },
  ilguma: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Papludimys", papludimysSchema);
