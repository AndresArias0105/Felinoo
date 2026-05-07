const pool = require('../config/db');

const userModel = {
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },

    createUser: (fullname, email, phone, username, hashed_password) => {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO users (fullname, email, phone, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', [fullname, email, phone, username, hashed_password], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    editUser: (row, value, id) => {
        return new Promise((resolve, reject) => {
            pool.query(`UPDATE users SET ${row} = $1 WHERE id = $2 RETURNING *`, [value, id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },
};

module.exports = userModel;