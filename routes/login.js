var express = require('express');
var bcrypt = require('bcryptjs'); // libreria para encriptar la contraseña
var jwt = require('jsonwebtoken'); // libreria para el token

var SEED = require('../config/config').SEED; // aqui importamos la variable SEED

var app = express();


var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });

        }

        // aqui revisamos que el email metido es correcto
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al ingresar email - email', // quitar -email cuando este en produccion
                errors: err
            });

        }

        // aqui comparamos la contraseña introducida con la que hay en la base de datos
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al ingresar password - password', // quitar -password cuando este en produccion
                errors: err
            });

        }

        // crear un token!!!!
        usuarioDB.password = '';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // expira en 4 horas,  14400 son segundos 

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    })
});


module.exports = app;