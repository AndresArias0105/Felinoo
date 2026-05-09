const pool = require('../config/db');

const adoptionRequestModel = {
    getAllAdoptionRequests: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    ar.*, 
                    u.fullname AS user_name, 
                    c.name AS cat_name,
                    c.estado AS cat_estado
                FROM adoption_requests ar
                LEFT JOIN users u ON ar.id_user = u.id_user
                LEFT JOIN cats c ON ar.id_cat = c.id_cat
                WHERE c.estado <> 'adoptado' and ar.estado = 'pendiente'
                ORDER BY ar.id_request DESC
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
    
    createAdoptionRequest(id_user, id_cat){
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO adoption_requests (id_user, id_cat, estado) VALUES ($1, $2, $3) RETURNING *', [id_user, id_cat, 'pendiente'], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            }); 
        });
    },

    acceptAdoptionRequest(id_request) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM adoption_requests WHERE id_request = $1', [id_request], (err, selRes) => {
                if (err) return reject(err);
                if (selRes.rows.length === 0) return reject(new Error("Request not found"));

                const request = selRes.rows[0];
                if (request.estado !== 'pendiente') {
                    return reject(new Error(`Request is already ${request.estado}`));
                }

                const id_cat = request.id_cat;
                pool.query('SELECT * FROM cats WHERE id_cat = $1', [id_cat], (err2, selRes2) => {
                    if (err2) return reject(err2);
                    if (selRes2.rows.length === 0) return reject(new Error("Cat not found"));

                    const cat = selRes2.rows[0];
                    if (cat.estado === 'adoptado') {
                        return reject(new Error("Cat is already adopted"));
                    }

                    pool.query('UPDATE cats SET estado = $1 WHERE id_cat = $2', ['adoptado', id_cat], (err3) => {
                        if (err3) return reject(err3);

                        pool.query('UPDATE adoption_requests SET estado = $1 WHERE id_request = $2 RETURNING *', ['aprobada', id_request], (err4, updRes) => {
                            if (err4) return reject(err4);
                            resolve(updRes.rows[0]);
                        });
                    });
                });
            });
        });
    },

    rejectAdoptionRequest(id_request){
        return new Promise((resolve, reject) => {
            pool.query('UPDATE adoption_requests SET estado = $1 WHERE id_request = $2 RETURNING *', ['rechazada', id_request], (error, results) => {
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