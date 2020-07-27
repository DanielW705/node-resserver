require("./config/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(require('./routes/usuario'))
mongoose.connect(
  "mongodb://localhost:27017/prueba",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE");
  }
);
app.listen(8080, () => {
  console.log(`Servidor realizado en el puerto 8080`);
});
