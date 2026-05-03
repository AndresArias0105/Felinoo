const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = '';
    let contentType = 'text/html';

    // Manejo de rutas
    if (req.url === '/' || req.url === '/index') {
        filePath = path.join(__dirname, 'views', 'index.html');
    } else if (req.url === '/login') {
        filePath = path.join(__dirname, 'views', 'login.html');
    } else if (req.url === '/register') {
        filePath = path.join(__dirname, 'views', 'register.html');
    } else if (req.url === '/adopt') {
        filePath = path.join(__dirname, 'views', 'adopt.html');
    } else if (req.url === '/support') {
        filePath = path.join(__dirname, 'views', 'support.html');
    } else if (req.url.startsWith('/styles/') || req.url.startsWith('/js/') || req.url.startsWith('/img/') || req.url.startsWith('/assets/')) {
        // Archivos estáticos en la carpeta public
        filePath = path.join(__dirname, 'public', req.url);
        
        // Determinar Content-Type correcto
        const extname = path.extname(filePath);
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpg';
                break;
        }
    } else {
        // Archivo no encontrado (por defecto intenta buscar en views)
        filePath = path.join(__dirname, 'views', req.url + '.html');
    }

    // Leer y servir el archivo
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Página no encontrada</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Error del servidor: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
