const adoptions = require('../models/adoption_model');

const adoptionsController = {
    listarTodasLasAdopciones: async (req, res) => {
        try {
            const adopciones = await adoptions.getAllAdoptionRequests();
            res.status(200).json({
                message: "Adopciones listadas exitosamente",
                adopciones: adopciones,
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

    crearAdopcion: async (req, res) => {
        try {
            const { id_user, id_cat } = req.body;
            const nuevaAdopcion = await adoptions.createAdoptionRequest(id_user, id_cat);
            res.status(201).json({
                message: "Adopción creada exitosamente",
                adopcion: nuevaAdopcion,
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

    aceptarAdopcion: async (req, res) => {
        try {
            const { id } = req.params;
            const adopcionAceptada = await adoptions.acceptAdoptionRequest(id);
            if (!adopcionAceptada) {
                return res.status(404).json({ message: "Adopción no encontrada" });
            }
            res.status(200).json({
                message: "Adopción aceptada exitosamente",
                adopcion: adopcionAceptada,
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

    rechazarAdopcion: async (req, res) => {
        try {
            const { id } = req.params;
            const adopcionRechazada = await adoptions.rejectAdoptionRequest(id);
            if (!adopcionRechazada) {
                return res.status(404).json({ message: "Adopción no encontrada" });
            }
            res.status(200).json({
                message: "Adopción rechazada exitosamente",
                adopcion: adopcionRechazada,
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
}

module.exports = adoptionsController;