const express = require("express");
const router = express.Router();
const rehome_controller = require("../controllers/rehome_controller");
const multer = require("multer");
const { storage } = require("../middlewares/cloudinary");

const upload = multer({ storage });

router.get("/", rehome_controller.listarTodosLosRehomes);
router.post("/solicitud", upload.single("foto-gato"), rehome_controller.crearRehome);
router.post("/aceptar/:id", rehome_controller.aceptarRehome);
router.post("/rechazar/:id", rehome_controller.rechazarRehome);

module.exports = router;