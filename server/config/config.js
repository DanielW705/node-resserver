//==================
// Puerto
//=================
process.env.PORT = process.env.PORT || 8080;
//==============
//Entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || "dev";
//================
//Vencimiento del token
//================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//===============
// Seed de autenticacion
//===============
process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";
//=============
//Base de datos
//=============
let urlDB;
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/prueba";
} else {
  urlDB = process.env.MONGO_URI;
}
process.env.urlDB = urlDB;
//========
// Google client Id
//========
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "89111469790-43uepajq1me1dg92fkt8icjbfr4rha8f.apps.googleusercontent.com";
