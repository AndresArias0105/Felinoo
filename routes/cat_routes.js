const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../middlewares/cloudinary");
const cat_controller = require("../controllers/cat_controller");

const upload = multer({ storage });

router.post("/admin/nuevo-gato", upload.single("foto-gato"), cat_controller.crearGato);

module.exports = router;
