import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import sql from './config/db.js';

console.log('Probando conexión a la base de datos...');

try {
    const result = await sql`SELECT 1 as test`;
    console.log('Conexión exitosa:', result);
} catch (error) {
    console.error('Error de conexión:', error.message);
} finally {
    await sql.end();
}