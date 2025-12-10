const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.registrar);

router.post("/login", authController.iniciarSesion);

// Perfil (usuario logueado)
router.get("/perfil", authMiddleware, authController.perfil);

module.exports = router;
