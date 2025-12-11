const express = require("express");
const router = express.Router();
const validationController = require("../controllers/validation.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware(["validator"]), validationController.validarQR);

router.get( "/validar-qr", authMiddleware, roleMiddleware(["validator"]), validationController.validarQR);

module.exports = router;
