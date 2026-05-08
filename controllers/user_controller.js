const user = require("../models/user_model");
const bcrypt = require("bcryptjs");

const hashPassword= async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}


const userController = {
    listarTodosLosUsuarios = async (req, res) => {
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

    crearUsuario = async (req, res) => {
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

    editarUsuario = async (req, res) => {
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

    loginUsuario = async (req, res) => {
        try {
            const { username, password } = req.body;
            const userData = await user.userLogin(username, password);
            if (!userData) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }
            const isPasswordValid = await comparePassword(password, userData.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }
            req.session.id_empleado = userData.id;
            req.session.rol= userData.rol;
            res.status(200).json({
                message: "Inicio de sesión exitoso",
                usuario: userData,
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

    logoutUsuario = (req, res) => {
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