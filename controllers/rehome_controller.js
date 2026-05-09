const rehome = require('../models/rehome_model');
const { crearAdopcion, rechazarAdopcion } = require('./adoption_controller');

const rehomeController = {
    listarTodosLosRehomes: async (req, res) => {
        try {
            const rehomes = await rehome.getAllRehomeRequests();
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

    crearRehome: async (req, res) => {
        try {
            const { id_user, cat_name, cat_age, cat_description } = req.body;
            const img_url = req.file ? req.file.path : null;
            if (!img_url) {
                return res.status(400).json({ message: "La imagen del gatito es obligatoria" });
            }

            if (!id_user || !cat_name || !cat_age || !cat_description) {
                return res.status(400).json({ message: "Faltan campos obligatorios para crear el rehome" });
            }

            if (isNaN(cat_age) || cat_age < 0) {
                return res.status(400).json({ message: "Edad del gatito inválida" });
            }
            
            const nuevoRehome = await rehome.createRehomeRequest(id_user, cat_name, cat_age, cat_description, img_url);
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

    aceptarRehome: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedRehome = await rehome.acceptRehomeRequest(id);
            if (!updatedRehome) {
                return res.status(404).json({ message: "Rehome no encontrado" });
            }
            res.status(200).json({
                message: "Rehome aceptado exitosamente",
                rehome: updatedRehome
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

    rechazarRehome: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedRehome = await rehome.rejectRehomeRequest(id);
            if (!updatedRehome) {
                return res.status(404).json({ message: "Rehome no encontrado" });
            }
            res.status(200).json({
                message: "Rehome rechazado exitosamente",
                rehome: updatedRehome
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