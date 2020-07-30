const express = require("express");
const app = express();
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const {
  verificarToken,
  verificarRol,
} = require("../middlewares/autenticacion");
app.get("/usuario", verificarToken, (req, res) => {
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 0;
  Usuario.find({ estado: true }, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
          send: body,
        });
      }
      Usuario.count({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });
});
app.post("/usuario", [verificarToken, verificarRol], (req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });
  usuario.save((err, usuaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
        send: body,
      });
    }
    res.json({
      ok: true,
      usuario: usuaDB,
    });
  });
});
app.put("/usuario/:id", [verificarToken, verificarRol], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);
  Usuario.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: "query",
    },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
          send: body,
        });
      }
      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});
app.delete("/usuario/:id", [verificarToken, verificarRol], (req, res) => {
  let id = req.params.id;
  Usuario.findOneAndUpdate(
    id,
    { estado: false },
    { new: true },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
          id,
        });
      }
      if (isNull(usuarioBorrado)) {
        return res.status(400).json({
          ok: false,
          error: {
            message: "Usuario no encontrado",
          },
          id,
        });
      }
      res.json({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err,
  //       id,
  //     });
  //   }
  //   if (isNull(usuarioBorrado)) {
  //     return res.status(400).json({
  //       ok: false,
  //       error: {
  //         message: "Usuario no encontrado",
  //       },
  //       id,
  //     });
  //   }
  //   res.json({
  //     ok: true,
  //     usuario: usuarioBorrado,
  //   });
  // });
});
module.exports = app;
