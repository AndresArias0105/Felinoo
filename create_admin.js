require('dotenv').config();
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        // Check if admin exists
        const res = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);
        if (res.rows.length > 0) {
            // Update
            await pool.query('UPDATE users SET password_hash = $1, role = $2 WHERE username = $3', [hash, 'admin', 'admin']);
            console.log('Admin user updated');
        } else {
            // Insert
            await pool.query('INSERT INTO users (fullname, email, phone, username, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6)', ['Administrador', 'admin@felinoo.com', '00000000', 'admin', hash, 'admin']);
            console.log('Admin user created');
        }
    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        process.exit();
    }
}

createAdmin();
