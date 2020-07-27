const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  email: {
    type: String,
    required: [true, "Es necesario un correo"],
  },
  password: {
    type: String,
    required: [true, "Es necesario una contraseña"],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
  },
  estado: {
    type: Boolean,
    default: true,
    required: false,
  },
  google: {
    type: Boolean,
    default: false,
    required: false,
  },
});
module.exports = mongoose.model("Usuario", usuarioSchema);
