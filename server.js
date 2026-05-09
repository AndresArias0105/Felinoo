const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const session = require('express-session');
const user_routes = require('./routes/user_routes');
const cat_routes = require('./routes/cat_routes');
const adoption_routes = require('./routes/adoption_routes');
const rehome_routes = require('./routes/rehome_routes');
const donations_routes = require('./routes/donations_routes');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo después de 15 minutos",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1); 
app.use(session({
    secret: 'secret-key',
    resave: true, 
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

app.use('/api/cats', cat_routes);
app.use('/api/users', user_routes);
app.use('/api/adoptions', adoption_routes);
app.use('/api/rehomes', rehome_routes);
app.use('/api/donations', donations_routes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/adopt', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'adopt.html'));
});
app.get('/rehome', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'rehome.html'));
});
app.get('/support', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'support.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user_id && req.session.rol === 'admin') {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/admin', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});
app.get('/requests', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'requests.html'));
});
app.get('/register_cat', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register_cat.html'));
});
app.get('/supports', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'supports.html'));
});



const PORT = process.env.PORT || 3000;


if (!process.env.VERCEL) {
    const server = app.listen(PORT, () => {
        console.log(`
        ====================================================
        SERVIDOR LOCAL INICIADO
        Puerto: ${PORT}
        URL: http://localhost:${PORT}
        ====================================================
        `);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(` ERROR: El puerto ${PORT} ya está siendo usado.`);
            process.exit(1);
        } else {
            console.error(' Error al iniciar el servidor:', error);
        }
    });
}

module.exports = app;
