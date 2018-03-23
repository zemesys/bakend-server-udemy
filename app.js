// Requires importacion de librerias para que funcione algo
var express = require('express');
var mongoose = require('mongoose');


// inicializar variables
var app = express();

// conexion a la base de datos 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    // si hay algun error detiene todo el proceso  
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Rutas 

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'

    });


});



// escuchar peticiones   3000 es un puerto puede ser qualquiera  8080, 4100 4200,  uno que no usemos vamos
app.listen(3000, () => {

    //app.listen(3000, function(){       podemos escribir una funcion de estas dos maneras  "function()" o  "() =>"      
    //}   
    console.log('Expres server puerto 3000: \x1b[32m%s\x1b[0m', 'online'); //  : \x1b[32m%s  este codigo cambia al color verde la palabra online y con este \[0m' , cierra el codigo   

});