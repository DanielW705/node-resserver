require("./config/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const port = process.env.Port || 8080;
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
app.listen(process.env.PORT, () => {
  console.log(`Servidor realizado en el puerto ${process.env.PORT}`);
});
