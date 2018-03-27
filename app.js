// Requires importacion de las librerias que necesitamos 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// inicializar variables
var app = express();


// Body Parse
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// importar rutas
var appRuotes = require('./routes/app');
var usuarioRuotes = require('./routes/usuario');
var loginRuotes = require('./routes/login');


// conexion a la base de datos 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    // si hay algun error detiene todo el proceso  
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});


// Rutas        aqui dejamos siempre el appRuotes el ultimo
app.use('/usuario', usuarioRuotes);
app.use('/login', loginRuotes);
app.use('/', appRuotes);




// escuchar peticiones   3000 es un puerto, puede ser qualquiera  8080, 4100 4200, etc..  que no usemos.
app.listen(3000, () => {

    console.log('Expres server puerto 3000: \x1b[32m%s\x1b[0m', 'online'); //  : \x1b[32m%s  este codigo cambia al color verde la palabra online y con este \[0m' , cierra el codigo   

});