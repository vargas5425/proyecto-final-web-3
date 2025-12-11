const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registration.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const soloParticipante = require("../middlewares/soloParticipante");
const { uploadComprobante } = require("../middlewares/uploadMiddleware");

router.post("/:eventoId/inscribirse", authMiddleware, soloParticipante, registrationController.inscribirse);

router.get("/event/:eventId", authMiddleware, registrationController.getRegistrationsByEvent);

router.post("/:eventoId/comprobante", authMiddleware, uploadComprobante, registrationController.subirComprobante);

router.put("/:registroId/validate", authMiddleware, registrationController.validateComprobante);

router.delete("/:registroId", authMiddleware, registrationController.cancelRegistration);

router.get("/:registroId/qr", authMiddleware, registrationController.generarQR);

router.get("/mine", authMiddleware, registrationController.getMyRegistrations);

module.exports = router;
