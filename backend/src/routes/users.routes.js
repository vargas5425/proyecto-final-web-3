const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Listar usuarios (solo admin)
router.get("/", authMiddleware, roleMiddleware(["admin"]), userController.listarUsuarios);

// Actualizar usuario (nombre, email, rol)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), userController.actualizarUsuario);

// Cambiar contraseña
router.put("/:id/password", authMiddleware, roleMiddleware(["admin"]), userController.cambiarContrasena);

// Eliminar usuario
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), userController.eliminarUsuario);

module.exports = router;
