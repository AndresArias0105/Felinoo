const donation = require('../models/donations_model');

const donationController = {
    listarTodasLasDonaciones: async (req, res) => {
        try {
            const donaciones = await donation.getAllDonations();
            res.status(200).json({
                message: "Donaciones listadas exitosamente",
                donaciones: donaciones,
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
    crearDonacion: async (req, res) => {
        try {
            const { id_user, amount, payment_method } = req.body;
            const nuevaDonacion = await donation.createDonation(id_user || null, amount, payment_method);
            res.status(201).json({
                message: "Donación registrada exitosamente",
                donacion: nuevaDonacion,
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

module.exports = donationController;