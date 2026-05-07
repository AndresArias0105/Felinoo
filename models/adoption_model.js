const pool = require('../config/db');

const adoptionRequestModel = {
    getAllAdoptionRequests: () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM adoption_requests', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },
    
    createAdoptionRequest(id_user, id_cat){
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO adoption_requests (id_user, id_cat) VALUES ($1, $2) RETURNING *', [id_user, id_cat], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            }); 
        });
    },

    acceptAdoptionRequest(id){
        return new Promise((resolve, reject) => {
            pool.query('UPDATE adoption_requests SET status = $1 WHERE id = $2 RETURNING *', ['accepted', id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            }); 
        });
    },

    rejectAdoptionRequest(id){
        return new Promise((resolve, reject) => {
            pool.query('UPDATE adoption_requests SET status = $1 WHERE id = $2 RETURNING *', ['rejected', id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            }); 
        });
    },
}

module.exports = adoptionRequestModel;