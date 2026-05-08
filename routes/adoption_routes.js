const express = require("express");
const router = express.Router();
const multer = require("multer");
const adoption_controller = require("../controllers/adoption_controller");

router.get("/", adoption_controller.listarTodasLasAdopciones);
router.post("/solicitud", adoption_controller.crearAdopcion);
router.post("/aceptar/:id", adoption_controller.aceptarAdopcion);
router.post("/rechazar/:id", adoption_controller.rechazarAdopcion);

module.exports = router;