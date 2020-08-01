const jwt = require("jsonwebtoken");
//==================
// Verificar Token
//==================
let verificarToken = (req, res, next) => {
  let token = req.get("Authorization");
  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        error: {
          message: "Ese token no es valido",
        },
      });
    }
    req.usuario = decode.usuario;
    next();
  });
};
//================
// Verifica Admin
//================
const verificarRol = (req, res, next) => {
  let usuario = req.usuario;
  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      error: {
        message: "Usted no es un administrador",
      },
    });
  }
};
let verificaTokenImg = (req, res, next) => {
  let token = req.query.token;
  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        error: {
          message: "Ese token no es valido",
        },
      });
    }
    req.usuario = decode.usuario;
    next();
  });
};
module.exports = {
  verificarToken,
  verificarRol,
  verificaTokenImg,
};
