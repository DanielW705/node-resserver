const express = require("express");
const {
  verificarToken,
  verificarRol,
} = require("../middlewares/autenticacion");
const app = express();
const Categoria = require("../models/categoria");
const _ = require("underscore");
//============
// Generar un servicio que muestre todas las categorias
//============
//get
app.get("/categoria", verificarToken, (req, res) => {
  Categoria.find({})
    .sort("descripcion")
    .populate("usuario", "nombre email")
    .exec()
    .then((categoriaDB) => {
      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    });
});
//===========
// Mostrar una categoria en particular por Id
//===========
//get
app.get("/categoria/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  Categoria.findById(id)
    .then((categoriaDB) => {
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          error: "No existe esta categoria",
          send: id,
        });
      } else {
        return res.json({
          ok: true,
          categoria: categoriaDB,
        });
      }
    })
    .catch((err) => {
      return res.status(417).json({
        ok: false,
        error: err,
        send: id,
      });
    });
});
//===========
// Crear nueva categoria
// Regresa una categoria
//==========
//post
//, [verificarToken, verificarRol]
app.post("/categoria", verificarToken, (req, res) => {
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });
  categoria
    .save()
    .then((categoriaDB) => {
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          error: err,
          send: body,
        });
      } else {
        res.json({
          ok: true,
          categoria: categoriaDB,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        ok: false,
        error: err,
        send: body,
      });
    });
});
// =========
// Actualizar las categorias
//============
//put
app.put("/categoria/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["descripcion"]);
  Categoria.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
    context: "query",
  })
    .then((categoriaDB) => {
      if (categoriaDB) {
        return res.json({
          ok: true,
          categoria: categoriaDB,
        });
      } else {
        return res.status(500).json({
          ok: false,
          error: "No existe tal categoria",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        ok: false,
        error: err,
        send: body,
      });
    });
});
// ===========
// Borrar categoria
// Solo administrador borra categoria
// ===========
// delete
app.delete("/categoria/:id", [verificarToken, verificarRol], (req, res) => {
  let id = req.params.id;
  Categoria.findByIdAndRemove(id)
    .then((categoriaDB) => {
      if (categoriaDB) {
        return res.json({
          ok: true,
          categoria: categoriaDB,
        });
      } else {
        return res.status(400).json({
          ok: false,
          error: "El usuario no existe",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    });
});
module.exports = app;
