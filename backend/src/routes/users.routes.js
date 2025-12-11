const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware(["admin"]), userController.listarUsuarios);

router.put("/:id", authMiddleware, roleMiddleware(["admin"]), userController.actualizarUsuario);

router.put("/:id/password", authMiddleware, roleMiddleware(["admin"]), userController.cambiarContrasena);

router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), userController.eliminarUsuario);

module.exports = router;
