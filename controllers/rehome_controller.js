const rehome = require('../models/rehome_model');
const { crearAdopcion, rechazarAdopcion } = require('./adoption_controller');

const rehomeController = {
    listarTodosLosRehomes = async (req, res) => {
        try {
            const rehomes = await rehome.getAllRehomes();
            res.status(200).json({
                message: "Rehomes listados exitosamente",
                rehomes: rehomes,
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

    crearRehome = async (req, res) => {
        try {
            const { id_user, id_cat } = req.body;
            const nuevoRehome = await rehome.createRehome(id_user, id_cat);
            res.status(201).json({
                message: "Rehome creado exitosamente",
                rehome: nuevoRehome,
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

    aceptarRehome = async (req, res) => {
        try {
            const { id } = req.params;
            const rehome = await rehome.getRehomeById(id);
            if (!rehome) {
                return res.status(404).json({
                    message: "Rehome no encontrado"
                });
            }
            await rehome.aceptar();
            res.status(200).json({
                message: "Rehome aceptado exitosamente",
                rehome: rehome
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

    rechazarRehome = async (req, res) => {
        try {
            const { id } = req.params;
            const rehome = await rehome.getRehomeById(id);
            if (!rehome) {
                return res.status(404).json({
                    message: "Rehome no encontrado"
                });
            }
            await rehome.rechazar();
            res.status(200).json({
                message: "Rehome rechazado exitosamente",
                rehome: rehome
            });
        } catch (error) {
            console.error("=== ERROR CRÍTICO EN EL SERVIDOR ===");
            console.dir(error);
            return res.status(500).json({
                message: "Error interno del servidor",
                details: error.message || error
            });
        }
    }
};

module.exports = rehomeController;