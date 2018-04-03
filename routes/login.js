const express = require('express');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('TU ID DE GOOGLE');
const Usuario = require('../models/usuario');
const app = express();


//=============================
//  Autentificacion Google
//=============================

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }
        } else {
            // Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            });
        }
    });
});


//=============================
//  Autentificacion Normal 
//=============================
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