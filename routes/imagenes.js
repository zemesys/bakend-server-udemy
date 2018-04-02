var express = require('express');

var fs = require('fs');

var app = express();

//===============================
// crear la ruta para obtener imagenes
// 
//===============================

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./uploads/${ tipo }/${ img }`;

    fs.exists(path, existe => {

        // si no existe este es la imagen a mostrar     
        if (!existe) {
            path = './assets/no-img.jpg';
        }

        // si existe mandamos la imagen 
        res.sendfile(path);


    })


});

module.exports = app;