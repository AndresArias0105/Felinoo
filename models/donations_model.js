const pool = require('../config/db');

const donationModel = {
    createDonation(id_user, amount, payment_method, donation_date){
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO donations (id_user, amount, payment_method, donation_date) VALUES ($1, $2, $3, $4) RETURNING *', [id_user, amount, payment_method, donation_date || new Date().toISOString()], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    getAllDonations: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    d.*, 
                    u.fullname AS user_name 
                FROM donations d
                LEFT JOIN users u ON d.id_user = u.id_user
                ORDER BY d.id_donation DESC
            `;
            pool.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },
}

module.exports = donationModel;
