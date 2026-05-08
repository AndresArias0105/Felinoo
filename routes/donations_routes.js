const express = require("express");
const router = express.Router();
const donations_controller = require("../controllers/donations_controller");

router.get("/", donations_controller.listarTodasLasDonaciones);

module.exports = router;