const pool = require('../config/db');

const catModel ={
    getAllCats: () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM cats', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },

    createCat: (name, age, description, img_url) => {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO cats (name, age, description, img_url) VALUES ($1, $2, $3, $4) RETURNING *', [name, age, description, img_url], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    getCatById: (id) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM cats WHERE id = $1', [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    updateCat: (id, name, age, description, img_url) => {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE cats SET name = $1, age = $2, description = $3, img_url = $4 WHERE id = $5 RETURNING *', [name, age, description, img_url, id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    deleteCat: (id) => {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM cats WHERE id = $1 RETURNING *', [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    getAdoptedCats: () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM cats WHERE adopted = true', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },



}

module.exports = catModel;