// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Solo admin puede crear usuarios con rol específico
router.post(
  "/crear-usuario",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.crearUsuarioConRol
);

// Temporalmente
//router.post("/crear-usuario", adminController.crearUsuarioConRol);


module.exports = router;
