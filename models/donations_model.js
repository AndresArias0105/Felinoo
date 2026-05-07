const pool = require('../config/db');

const donationModel = {
    createDonation(id_user, amount, payment_method){
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO donations (id_user, amount, payment_method) VALUES ($1, $2, $3) RETURNING *', [id_user, amount, payment_method], (error, results) => {
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
            pool.query('SELECT * FROM donations', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },
}
