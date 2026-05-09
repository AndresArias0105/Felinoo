const user = require("../models/user_model");
const bcrypt = require("bcryptjs");

const hashPassword= async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const comparePassword = async (password, hashedPassword) => {
    if (!hashedPassword) return false;
    if (password === hashedPassword) return true; // Fallback for old plaintext accounts
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (e) {
        return false;
    }
}


const userController = {
    listarTodosLosUsuarios: async (req, res) => {
        try {
            const usuarios = await user.getAllUsers();
            res.status(200).json({
                message: "Usuarios listados exitosamente",
                usuarios: usuarios,
            });
        } catch (error) {
            console.error("=== ERROR CRÍTICO EN EL SERVIDOR ===");
            console.dir(error);
            return res.status(500).json({
                message: "Error interno del servidor",
                details: error.message || error
            });
        }
    },

    crearUsuario: async (req, res) => {
        try {
            const { fullname, email, phone, username, password } = req.body;
            const hashed_password = await hashPassword(password);
            const newUsuario = await user.createUser(fullname, email, phone, username, hashed_password);
            res.status(201).json({
                message: "Usuario creado exitosamente",
                usuario: newUsuario,
            });
        } catch (error) {
            console.error("=== ERROR CRÍTICO EN EL SERVIDOR ===");
            console.dir(error);
            return res.status(500).json({
                message: "Error interno del servidor",
                details: error.message || error
            });
        }
    },

    editarUsuario: async (req, res) => {
        try {
            const { id } = req.params;
            const { row, value } = req.body;
            const updatedUsuario = await user.editUser(row, value, id);
            if (!updatedUsuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
                res.status(200).json({
                message: "Usuario actualizado exitosamente",
                usuario: updatedUsuario,
            });
        } catch (error) {
            console.error("=== ERROR CRÍTICO EN EL SERVIDOR ===");
            console.dir(error);
            return res.status(500).json({
                message: "Error interno del servidor",
                details: error.message || error
            });
        };
    },

    loginUsuario: async (req, res) => {
        try {
            const { username, password } = req.body;
            const userData = await user.userLogin(username);
            if (!userData) {
                return res.status(401).json({ message: "Usuario no encontrado" });
            }
            const isPasswordValid = await comparePassword(password, userData.password_hash || userData.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }
            if (!req.session) {
                return res.status(500).json({ message: "Error al iniciar sesión: No se pudo crear la sesión" });
            }
            
            req.session.id_empleado = userData.id_user || userData.id;
            req.session.rol = userData.role || userData.rol;
            req.session.user_id = userData.id_user || userData.id;
            req.session.username = userData.username;
            req.session.save((err) => {
                if (err) {
                    console.error("Error al guardar sesión", err);
                    return res.status(500).json({ message: "Error interno del servidor al iniciar sesión" });
                }
                res.status(200).json({
                    message: "Inicio de sesión exitoso",
                    usuario: userData,
                });
            });


        } catch (error) {
            console.error("=== ERROR CRÍTICO EN EL SERVIDOR ===");
            console.dir(error);
            return res.status(500).json({
                message: "Error interno del servidor",
                details: error.message || error
            });
        }
    },

    verificarSesion: (req, res) => {
        if (req.session && req.session.user_id) {
            res.status(200).json({
                user_id: req.session.user_id,
                username: req.session.username,
                rol: req.session.rol
            });
        } else {
            res.status(401).json({ message: "No hay sesión activa" });
        }
    },

    logoutUsuario: (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error al destruir la sesión:", err);
                    return res.status(500).json({ message: "Error al cerrar sesión" });
                }
                res.clearCookie('connect.sid');
                res.status(200).json({ message: "Cierre de sesión exitoso" });
            });
        }catch (error) {
            console.error("=== ERROR CRÍTICO EN EL SERVIDOR ===");
            console.dir(error);
            return res.status(500).json({
                message: "Error interno del servidor",
                details: error.message || error
            });
        };
    }

};

module.exports = userController;