const express = require("express");
const { verificarToken } = require("../middlewares/autenticacion");
let app = express();
let Producto = require("../models/producto");
const _ = require("underscore");
// ========
// Obtener todos los productos
// cargar al usuario y categoria (populate)
//paginado
//=========
app.get("/producto", verificarToken, (req, res) => {
  let desde = Number(req.params.desde) || 0;
  let hasta = Number(req.params.hasta) || 0;
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(hasta)
    .populate("usuario categoria", "nombre email descripcion")
    .sort("productos")
    .exec()
    .then((productoDb) => {
      return res.json({
        ok: true,
        productos: productoDb,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    });
});
//=========
//Obtener un producto en especial
//cargar usuario y categoria
//=========
app.get("/producto/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id)
    .populate("usuario categoria", "nombre email descripcion")
    .exec()
    .then((productoDb) => {
      if (productoDb) {
        return res.json({
          ok: true,
          producto: productoDb,
        });
      } else {
        return res.status(400).json({
          ok: false,
          error: "No existe ese producto",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        ok: false,
        error: err,
      });
    });
});
//=========
// Crear un nuevo producto
// grabar el usuario
// grabar una categoria del listado
//=========
app.post("/producto", verificarToken, (req, res) => {
  let body = req.body;
  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  });
  producto
    .save()
    .then((productoDb) => {
      res.status(201).json({
        ok: true,
        producto: productoDb,
      });
    })
    .catch((err) => {
      res.status(400).json({
        ok: false,
        error: err,
      });
    });
});
//=========
// Actualizar un producto
//=========
app.put("/producto/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["precioUni", "nombre", "categoria"]);
  Producto.findOneAndUpdate(id, body, {
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
    context: "query",
  })
    .then((productoDb) => {
      if (productoDb) {
        return res.json({
          ok: true,
          producto: productoDb,
        });
      } else {
        return res.status(500).json({
          ok: false,
          error: "No existe ese producto",
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
//=========
// Borrar un producto
// Disponibilidad falsa
//=========
app.delete("/producto/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  Producto.findByIdAndUpdate(
    id,
    { disponible: false },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: "query",
    }
  )
    .then((productoDb) => {
      if (productoDb) {
        return res.json({
          ok: true,
          producto: productoDb,
        });
      } else {
        return res.status(500).json({
          ok: false,
          error: "No existe ese producto",
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
//================
// Buscar productos
//================
app.get("/producto/buscar/:termino", verificarToken, (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, "i");
  Producto.find({ nombre: regex, disponible: true })
    .populate("categoria", "nombre")
    .exec()
    .then((productoDb) => {
      return res.json({
        ok: true,
        producto: productoDb,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    });
});
module.exports = app;
