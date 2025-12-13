const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { uploadAfiche } = require("../middlewares/uploadMiddleware");

router.get("/", eventController.listar);

router.get("/:id", eventController.obtenerUno);

router.get("/:id/inscritos", authMiddleware, roleMiddleware(["organizer"]), eventController.obtenerInscritos);

router.get("/:id/report", authMiddleware, roleMiddleware(["organizer"]), eventController.obtenerReporte);

router.post( "/", authMiddleware, roleMiddleware(["organizer"]), uploadAfiche, eventController.crear);

router.put("/:id", authMiddleware, roleMiddleware(["organizer"]), uploadAfiche, eventController.editar);

router.delete("/:id", authMiddleware, roleMiddleware(["organizer"]), eventController.eliminar);

module.exports = router;
