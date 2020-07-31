const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require("../models/usuario");
const app = express();
app.post("/login", (req, res) => {
  let body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
        send: body,
      });
    }
    if (!usuarioDb || !bcrypt.compareSync(body.password, usuarioDb.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o contraseña son incorrectos",
        },
        send: body,
      });
    }
    let token = jwt.sign(
      {
        usuario: usuarioDb,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );
    res.json({
      ok: true,
      usuario: usuarioDb,
      token,
    });
  });
});
// Config gooogle
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}
app.post("/google", async (req, res) => {
  let token = req.body.idtoken;
  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      error: e.message,
    });
  });
  Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (usuarioDb) {
      if (usuarioDb.google === false) {
        return res.status(500).json({
          ok: false,
          error: {
            message: "Debe usar su autenticacion normal",
          },
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDb,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          usuario: usuarioDb,
          token,
          signIn: true,
        });
      }
    } else {
      // Si es que el usuario no existe
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";
      usuario.save((err, usuarioDb) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        let token = jwt.sign(
          {
            usuario: usuarioDb,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          usuario: usuarioDb,
          token,
        });
      });
    }
  });
});
module.exports = app;
