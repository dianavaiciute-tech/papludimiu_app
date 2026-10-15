const Papludimys = require("./modeliai/papludimys");
const Stebejimas = require("./modeliai/stebejimas");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Backend veikia!");
});

app.use(cors());
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
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Neteisingi paplūdimio duomenys",
      });
    }

    console.error("Paplūdimio kūrimo klaida:", error);

    res.status(500).json({
      message: "Įvyko serverio klaida kuriant paplūdimį",
    });
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
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Neteisingi paplūdimio duomenys arba ID",
      });
    }

    console.error("Paplūdimio atnaujinimo klaida:", error);

    res.status(500).json({
      message: "Įvyko serverio klaida atnaujinant paplūdimį",
    });
  }
});

app.delete("/api/papludimiai/:id", async (req, res) => {
  try {
    const susijeStebejimai = await Stebejimas.find({
      papludimys: req.params.id,
    });

    if (susijeStebejimai.length > 0) {
      return res.status(400).json({
        message:
          "Negalima ištrinti paplūdimio, nes jis turi vandens stebėjimų. Pirmiausia ištrinkite susijusius stebėjimus.",
      });
    }

    const istrintasPapludimys = await Papludimys.findByIdAndDelete(
      req.params.id,
    );

    if (!istrintasPapludimys) {
      return res.status(404).json({
        message: "Paplūdimys nerastas",
      });
    }

    res.status(200).json({
      message: "Paplūdimys ištrintas",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Neteisingas paplūdimio ID",
      });
    }

    console.error("Paplūdimio trynimo klaida:", error);

    res.status(500).json({
      message: "Įvyko serverio klaida trinant paplūdimį",
    });
  }
});

app.get("/api/stebejimai", async (req, res) => {
  try {
    const stebejimai = await Stebejimas.find().populate("papludimys");

    res.status(200).json(stebejimai);
  } catch (error) {
    console.error("Stebėjimų gavimo klaida:", error);

    res.status(500).json({
      message: "Nepavyko gauti stebėjimų.",
    });
  }
});

app.post("/api/stebejimai", async (req, res) => {
  try {
    const naujasStebejimas = new Stebejimas(req.body);
    const issaugotasStebejimas = await naujasStebejimas.save();

    res.status(201).json(issaugotasStebejimas);
  } catch (error) {
    if (error.name === "ValidationError") {
      const klaidos = Object.values(error.errors).map(
        (laukas) => laukas.message,
      );

      return res.status(400).json({
        message: `Klaida: ${klaidos.join(". ")}`,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Neteisingi stebėjimo duomenys.",
      });
    }

    console.error("Stebėjimo kūrimo klaida:", error);

    res.status(500).json({
      message: "Įvyko serverio klaida kuriant stebėjimą.",
    });
  }
});

app.put("/api/stebejimai/:id", async (req, res) => {
  try {
    const atnaujintasStebejimas = await Stebejimas.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!atnaujintasStebejimas) {
      return res.status(404).json({ message: "Stebėjimas nerastas" });
    }

    res.status(200).json(atnaujintasStebejimas);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      const klaidos =
        error.name === "ValidationError"
          ? Object.values(error.errors).map((laukas) => laukas.message)
          : [];

      return res.status(400).json({
        message:
          klaidos.length > 0
            ? klaidos.join(". ")
            : "Neteisingi stebėjimo duomenys arba ID",
      });
    }

    console.error("Stebėjimo atnaujinimo klaida:", error);

    res.status(500).json({
      message: "Įvyko serverio klaida atnaujinant stebėjimą",
    });
  }
});

app.delete("/api/stebejimai/:id", async (req, res) => {
  try {
    const istrintasStebejimas = await Stebejimas.findByIdAndDelete(
      req.params.id,
    );

    if (!istrintasStebejimas) {
      return res.status(404).json({
        message: "Stebėjimas nerastas",
      });
    }

    res.status(200).json({
      message: "Stebėjimas ištrintas",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Neteisingas stebėjimo ID",
      });
    }

    console.error("Stebėjimo trynimo klaida:", error);

    res.status(500).json({
      message: "Įvyko serverio klaida trinant stebėjimą",
    });
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
