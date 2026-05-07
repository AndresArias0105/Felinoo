const pool = require('../config/db');

const rehomeRequestModel = {
    getAllRehomeRequests: () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM rehome_requests', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },

    createRehomeRequest(id_user, cat_name, cat_age, cat_description, img_url){
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO rehome_requests (id_user, cat_name, cat_age, cat_description, img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id_user, cat_name, cat_age, cat_description, img_url], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    acceptRehomeRequest(id){
        return new Promise((resolve, reject) => {
            pool.query('UPDATE rehome_requests SET status = $1 WHERE id = $2 RETURNING *', ['accepted', id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    rejectRehomeRequest(id){
        return new Promise((resolve, reject) => {
            pool.query('UPDATE rehome_requests SET status = $1 WHERE id = $2 RETURNING *', ['rejected', id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },
}

module.exports = rehomeRequestModel;