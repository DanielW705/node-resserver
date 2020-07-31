require("./config/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// habilitar la carpeta publica
app.use(express.static(path.resolve(__dirname, "../public")));
// console.log(path.resolve(__dirname, "../public"));
//Configurar todas las rutas globales
app.use(require("./routes/index"));
mongoose.connect(
  process.env.urlDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE");
  }
);
app.listen(process.env.PORT, () => {
  console.log(`Servidor realizado en el puerto ${process.env.PORT}`);
});
