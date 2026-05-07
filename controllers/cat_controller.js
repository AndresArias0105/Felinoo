const cat = require("../models/cat_model");

exports.crearGato = async (req, res) => {
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
    }
};