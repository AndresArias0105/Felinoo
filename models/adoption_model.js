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
            pool.query('INSERT INTO adoption_requests (id_user, id_cat, estado) VALUES ($1, $2, $3) RETURNING *', [id_user, id_cat, 'pendiente'], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows[0]);
                }
            }); 
        });
    },

    acceptAdoptionRequest(id_request){
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM adoption_requests WHERE id_request = $1', [id_request], (err, selRes) => {
                if (err) return reject(err);
                if (selRes.rows.length === 0) return reject(new Error("Request not found"));
                
                const request = selRes.rows[0];
                
                pool.query('UPDATE cats SET estado = $1 WHERE id_cat = $2', ['adoptado', request.id_cat], (err2) => {
                    if (err2) return reject(err2);
                    
                    pool.query('UPDATE adoption_requests SET estado = $1 WHERE id_request = $2 RETURNING *', ['aprobada', id_request], (err3, updRes) => {
                        if (err3) return reject(err3);
                        resolve(updRes.rows[0]);
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