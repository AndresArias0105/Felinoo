const donation = require('../models/donation_model');

const donationController = {
    listarTodasLasDonaciones = async (req, res) => {
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
    }
};

module.exports = donationController;