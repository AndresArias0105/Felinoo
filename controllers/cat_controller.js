const cat = require("../models/cat_model");

const catController = {
    listarTodosLosGatos = async (req, res) => {
        try {
            const gatos = await cat.getAllCats();
            res.status(200).json({
                message: "Gatos listados exitosamente",
                gatos: gatos,
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

    crearGato = async (req, res) => {
        try {
            const { name, age, description } = req.body;

            const img_url = req.file ? req.file.path : null;

            if (!img_url) {
                return res.status(400).json({ message: "Error al crear gato: Imagen no subida" });
            }

            const ageInt = parseInt(age) || 0;
            const newGato = await cat.createCat(name, ageInt, description, img_url);

            res.status(201).json({
                message: "Gato creado exitosamente",
                gato: newGato,
            });
        }
        catch (error) {
            console.error("=== ERROR CRÍTICO EN EL SERVIDOR ===");
            console.dir(error);
            return res.status(500).json({ 
                message: "Error interno del servidor", 
                details: error.message || error 
            });
        };
    },

    getGatoPorId = async (req, res) => {
        try {
            const { id } = req.params;
            const gato = await cat.getCatById(id);
            if (!gato) {
                return res.status(404).json({ message: "Gato no encontrado" });
            }
            res.status(200).json({
                message: "Gato encontrado exitosamente",
                gato: gato,
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

    editarGato = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, age, description } = req.body;
            const img_url = req.file ? req.file.path : null;
            const ageInt = parseInt(age) || 0;

            const updatedGato = await cat.updateCat(id, name, ageInt, description, img_url);

            if (!updatedGato) {
                return res.status(404).json({ message: "Gato no encontrado" });
            }
            res.status(200).json({
                message: "Gato actualizado exitosamente",
                gato: updatedGato,
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

    eliminarGato = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedGato = await cat.deleteCat(id);
            if (!deletedGato) {
                return res.status(404).json({ message: "Gato no encontrado" });
            }
            res.status(200).json({
                message: "Gato eliminado exitosamente",
                gato: deletedGato,
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

    listarGatosAdoptados = async (req, res) => {
        try {
            const adoptedCats = await cat.getAdoptedCats();
            res.status(200).json({
                message: "Gatos adoptados listados exitosamente",
                gatos: adoptedCats,
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

module.exports = catController;