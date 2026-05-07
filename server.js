const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const session = require('express-session');
const cat_routes = require('./routes/cat_routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/api/cats', cat_routes);

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



app.listen(3000, () => {
    console.log('Server is running on port 3000: http://localhost:3000');
});
