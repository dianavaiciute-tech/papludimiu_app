const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Backend veikia!");
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
