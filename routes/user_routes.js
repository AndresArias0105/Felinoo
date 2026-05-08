const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user_controller");

router.get("/", user_controller.listarTodosLosUsuarios);
router.get("/session", user_controller.verificarSesion);
router.post("/registro", user_controller.crearUsuario);
router.put("/:id", user_controller.editarUsuario);
router.post("/login", user_controller.loginUsuario);
router.post("/logout", user_controller.logoutUsuario);

module.exports = router;


