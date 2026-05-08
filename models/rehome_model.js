const pool = require('../config/db');

const rehomeRequestModel = {
    getAllRehomeRequests: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT rr.*, u.fullname as user_name 
                FROM rehome_requests rr
                JOIN users u ON rr.id_user = u.id_user
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

    createRehomeRequest(id_user, cat_name, cat_age, cat_description, img_url){
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO rehome_requests (id_user, cat_name, cat_age, cat_description, img_url, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id_user, cat_name, cat_age, cat_description, img_url, 'pendiente'], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            });
        });
    },

    acceptRehomeRequest(id_request){
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM rehome_requests WHERE id_request = $1', [id_request], (err, selRes) => {
                if (err) return reject(err);
                if (selRes.rows.length === 0) return reject(new Error("Request not found"));
                
                const rehome = selRes.rows[0];
                
                pool.query('INSERT INTO cats (name, age, description, img_url, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
                    [rehome.cat_name, parseInt(rehome.cat_age) || 0, rehome.cat_description, rehome.img_url, 'disponible'], 
                    (err2, insRes) => {
                        if (err2) return reject(err2);
                        
                        pool.query('UPDATE rehome_requests SET estado = $1 WHERE id_request = $2 RETURNING *', ['aprobada', id_request], (err3, updRes) => {
                            if (err3) return reject(err3);
                            resolve(updRes.rows[0]);
                        });
                });
            });
        });
    },

    rejectRehomeRequest(id_request){
        return new Promise((resolve, reject) => {
            pool.query('UPDATE rehome_requests SET estado = $1 WHERE id_request = $2 RETURNING *', ['rechazada', id_request], (error, results) => {
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