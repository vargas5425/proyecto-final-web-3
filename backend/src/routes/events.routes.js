const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { uploadAfiche } = require("../middlewares/uploadMiddleware");

// Crear evento (organizador)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["organizer"]),
  uploadAfiche,
  eventController.crear
);

// Listar todos los eventos (público)
router.get("/", eventController.listar);

// Obtener un evento por ID (público)
router.get("/:id", eventController.obtenerUno);

// Obtener inscritos de un evento (solo organizador)
router.get(
  "/:id/inscritos",
  authMiddleware,
  roleMiddleware(["organizer"]),
  eventController.obtenerInscritos
);

// **Nuevo endpoint: obtener reporte del evento, filtrable por fechas**
router.get(
  "/:id/report",
  authMiddleware,
  roleMiddleware(["organizer"]),
  eventController.obtenerReporte
);

// Editar evento (organizador)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["organizer"]),
  uploadAfiche, // opcional, por si se actualiza afiche
  eventController.editar
);

// Eliminar evento (solo organizador)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["organizer"]),
  eventController.eliminar
);

module.exports = router;
