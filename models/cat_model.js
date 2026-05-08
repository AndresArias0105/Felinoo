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
            // Usamos el orden exacto de las columnas: id_cat, name, age, description, img_url, estado, created_at
            pool.query('INSERT INTO cats VALUES (DEFAULT, $1, $2, $3, $4, \'disponible\', DEFAULT) RETURNING *', [name, age, description, img_url], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    getCatById: (id_cat) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM cats WHERE id_cat = $1', [id_cat], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    updateCat: (id_cat, name, age, description, img_url) => {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE cats SET name = $1, age = $2, description = $3, img_url = $4 WHERE id_cat = $5 RETURNING *', [name, age, description, img_url, id_cat], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    deleteCat: (id_cat) => {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM cats WHERE id_cat = $1 RETURNING *', [id_cat], (error, results) => {
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