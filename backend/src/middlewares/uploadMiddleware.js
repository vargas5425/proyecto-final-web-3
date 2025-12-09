const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

// 1. Subida de AFICHES
const storageAfiche = multer.diskStorage({
  destination: async (req, file, callback) => {
    const carpetaDestino = path.join(__dirname, "../../uploads/afiches");
    await fs.ensureDir(carpetaDestino);
    callback(null, carpetaDestino);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const nombreFinal =
      Date.now() + "-" + Math.random().toString(36).substring(2) + extension;

    callback(null, nombreFinal);
  },
});

// El campo del formulario debe llamarse "afiche"
const uploadAfiche = multer({ storage: storageAfiche }).single("afiche");

// 2. Subida de COMPROBANTES
const storageComprobante = multer.diskStorage({
  destination: async (req, file, callback) => {
    const carpetaDestino = path.join(__dirname, "../../uploads/comprobantes");
    await fs.ensureDir(carpetaDestino);
    callback(null, carpetaDestino);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const nombreFinal =
      Date.now() + "-" + Math.random().toString(36).substring(2) + extension;

    callback(null, nombreFinal);
  },
});

// El campo del formulario debe llamarse "comprobante"
const uploadComprobante = multer({ storage: storageComprobante }).single("comprobante");

module.exports = {
  uploadAfiche,
  uploadComprobante,
};
