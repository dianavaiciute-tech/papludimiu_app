const mongoose = require("mongoose");

const papludimysSchema = new mongoose.Schema({
  pavadinimas: {
    type: String,
    required: [true, "Būtina įvesti paplūdimio pavadinimą"],
    trim: true,
    minlength: [2, "Pavadinimas turi būti bent 2 simbolių"],
  },
  miestas: {
    type: String,
    required: [true, "Būtina įvesti miestą"],
    trim: true,
    minlength: [2, "Miesto pavadinimas turi būti bent 2 simbolių"],
  },
  platuma: {
    type: Number,
    required: [true, "Būtina įvesti platumą"],
    min: [-90, "Platuma negali būti mažesnė nei -90"],
    max: [90, "Platuma negali būti didesnė nei 90"],
  },
  ilguma: {
    type: Number,
    required: [true, "Būtina įvesti ilgumą"],
    min: [-180, "Ilguma negali būti mažesnė nei -180"],
    max: [180, "Ilguma negali būti didesnė nei 180"],
  },
});

module.exports = mongoose.model("Papludimys", papludimysSchema);
