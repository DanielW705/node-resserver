const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");
// Opciones para que guarde bien los datos
app.use(fileUpload({ useTempFiles: false }));
app.put("/upload/:tipo/:id", (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      error: "No se envio un archivo",
    });
  }
  // Validar los tipos
  let tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `Los tipos permitidos son ${tiposValidos.join(", ")}`,
      },
    });
  }
  let archivo = req.files.archivo;
  let nombresplit = archivo.name.split(".");
  let extension = nombresplit[nombresplit.length - 1];
  // Extensiones validas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `Las extenciones permitidas son ${extensionesValidas.join(
          ", "
        )}`,
      },
    });
  }
  // Cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
  if (tipo === "usuarios") {
    imagenUsuario(id, res, nombreArchivo);
  } else {
    imagenProducto(id, res, nombreArchivo);
  }
  borrarImagen(id, tipo);
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) return res.status(500).json({ ok: false, error: err });
    // Aqui ya se guardo el archivo
  });
});
const imagenUsuario = (id, res, nombreArchivo) => {
  Usuario.findByIdAndUpdate(
    id,
    { img: nombreArchivo },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: "query",
    }
  )
    .then((succ) => {
      if (succ) {
        return res.json({
          ok: true,
          usuario: succ,
          imagen: nombreArchivo,
        });
      } else {
        return res.status(500).json({
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
};
const imagenProducto = (id, res, nombreArchivo) => {
  Producto.findByIdAndUpdate(
    id,
    { img: nombreArchivo },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: "query",
    }
  )
    .then((succ) => {
      if (succ) {
        return res.json({
          ok: true,
          usuario: succ,
          imagen: nombreArchivo,
        });
      } else {
        return res.status(500).json({
          ok: false,
          error: "El producto no existe",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    });
};
const borrarImagen = (id, tipo) => {
  Usuario.findById(id)
    .then((succ) => {
      if (succ && succ.img) {
        let pathImagen = path.resolve(
          __dirname,
          `../../uploads/${tipo}/${succ.img}`
        );
        if (fs.existsSync(pathImagen)) {
          fs.unlinkSync(pathImagen);
        }
      }
    })
    .catch((err) => {});
};
module.exports = app;
