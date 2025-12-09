const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { uploadAfiche } = require("../middlewares/uploadMiddleware");

// Crear evento (organizador o admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["organizer", "admin"]),
  uploadAfiche,
  eventController.crear
);

// Listar todos los eventos (público)
router.get("/", eventController.listar);

// Obtener un evento por ID (público)
router.get("/:id", eventController.obtenerUno);

// Obtener inscritos de un evento (solo organizador o admin)
router.get(
  "/:id/inscritos",
  authMiddleware,
  roleMiddleware(["organizer", "admin"]),
  eventController.obtenerInscritos
);

// **Nuevo endpoint: obtener reporte del evento, filtrable por fechas**
router.get(
  "/:id/report",
  authMiddleware,
  roleMiddleware(["organizer", "admin"]),
  eventController.obtenerReporte
);

// Editar evento (organizador o admin)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["organizer", "admin"]),
  uploadAfiche, // opcional, por si se actualiza afiche
  eventController.editar
);

// Eliminar evento (solo organizador o admin)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["organizer", "admin"]),
  eventController.eliminar
);

module.exports = router;
