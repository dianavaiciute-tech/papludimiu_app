const Papludimys = require("./modeliai/papludimys");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Backend veikia!");
});

app.use(express.json());

app.get("/api/papludimiai", async (req, res) => {
  try {
    const papludimiai = await Papludimys.find();
    res.status(200).json(papludimiai);
  } catch (error) {
    res.status(500).json({ message: "Nepavyko gauti paplūdimių" });
  }
});

app.post("/api/papludimiai", async (req, res) => {
  try {
    const naujasPapludimys = new Papludimys(req.body);
    const issaugotasPapludimys = await naujasPapludimys.save();

    res.status(201).json(issaugotasPapludimys);
  } catch (error) {
    res.status(400).json({ message: "Nepavyko sukurti paplūdimio" });
  }
});

app.put("/api/papludimiai/:id", async (req, res) => {
  try {
    const atnaujintasPapludimys = await Papludimys.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!atnaujintasPapludimys) {
      return res.status(404).json({ message: "Paplūdimys nerastas" });
    }

    res.status(200).json(atnaujintasPapludimys);
  } catch (error) {
    res.status(400).json({ message: "Nepavyko atnaujinti paplūdimio" });
  }
});

app.delete("/api/papludimiai/:id", async (req, res) => {
  try {
    const istrintasPapludimys = await Papludimys.findByIdAndDelete(
      req.params.id,
    );

    if (!istrintasPapludimys) {
      return res.status(404).json({ message: "Paplūdimys nerastas" });
    }

    res.status(200).json({ message: "Paplūdimys ištrintas" });
  } catch (error) {
    res.status(400).json({ message: "Nepavyko ištrinti paplūdimio" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB prisijungė!");

    app.listen(5000, () => {
      console.log("Serveris veikia per 5000 prievadą");
    });
  })
  .catch((error) => {
    console.log("MongoDB prisijungimo klaida:", error.message);
  });
