const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol valido",
};
let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  email: {
    type: String,
    unique: true,
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
    enum: rolesValidos,
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
usuarioSchema.methods.toJSON = function ()  {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};
usuarioSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser un unico valor",
});
module.exports = mongoose.model("Usuario", usuarioSchema);
