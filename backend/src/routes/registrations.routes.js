const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registration.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const soloParticipante = require("../middlewares/soloParticipante");
const { uploadComprobante } = require("../middlewares/uploadMiddleware");

// Inscribirse a un evento (participante logueado)
router.post("/:eventoId/inscribirse", authMiddleware, soloParticipante, registrationController.inscribirse);

router.get("/event/:eventId", authMiddleware, registrationController.getRegistrationsByEvent);
// Subir comprobante de depósito
router.post(
  "/:eventoId/comprobante",
  authMiddleware,
  uploadComprobante,
  registrationController.subirComprobante
);

// Validar comprobante (organizador)
router.put("/:registroId/validate", authMiddleware, registrationController.validateComprobante);

// Cancelar inscripción (participante u organizador)
router.delete("/:registroId", authMiddleware, registrationController.cancelRegistration);

// Generar QR para registro
router.get("/:registroId/qr", authMiddleware, registrationController.generarQR);

// Obtener inscripciones del usuario logueado
router.get("/mine", authMiddleware, registrationController.getMyRegistrations);


module.exports = router;
