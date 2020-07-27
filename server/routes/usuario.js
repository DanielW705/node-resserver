const express = require("express");
const app = express();
app.get("/usuario", (req, res) => {
  res.json("Get usuario");
});
app.post("/usuario", (req, res) => {
  let body = req.body;
  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mesnaje: "El nombre es necesario",
    });
  } else {
    res.json({ body });
  }
});
app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});
app.delete("/usuario", (req, res) => {
  res.json("Delete usuario");
});
module.exports = app;