const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Backend veikia!");
});

app.listen(5000, () => {
  console.log("Serveris veikia per 5000 prievadą");
});

console.log("Failas paleistas");
