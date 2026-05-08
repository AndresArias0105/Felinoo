const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../middlewares/cloudinary");
const cat_controller = require("../controllers/cat_controller");

const upload = multer({ storage });

router.post("/admin/nuevo-gato", upload.single("foto-gato"), cat_controller.crearGato);
router.get("/", cat_controller.listarTodosLosGatos);
router.get("/:id", cat_controller.getGatoPorId);
router.put("/:id", upload.single("foto-gato"), cat_controller.editarGato);
router.delete("/:id", cat_controller.eliminarGato);
router.get("/adoptados", cat_controller.listarGatosAdoptados);

module.exports = router;

