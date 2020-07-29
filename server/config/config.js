//==================
// Puerto
//=================
process.env.PORT = process.env.PORT || 8080;
process.env.NODE_ENV = process.env.NODE_ENV || "dev";
let urlDB;
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/prueba";
} else {
  urlDB =
    "mongodb+srv://daniel:O0Nk2SXOaJ0gcJvv@cluster0.5hrqi.mongodb.net/cafe?retryWrites=true&w=majority";
}
process.env.urlDB = urlDB;
//mongodb+srv://daniel:O0Nk2SXOaJ0gcJvv@cluster0.5hrqi.mongodb.net/cafe?retryWrites=true&w=majority
//"mongodb://localhost:27017/prueba"
