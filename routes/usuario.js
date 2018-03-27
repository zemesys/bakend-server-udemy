var express = require('express');
var bcrypt = require('bcryptjs'); // libreria para encriptar la contraseña
var jwt = require('jsonwebtoken'); // libreria para el token

var mdAutenticacion = require('../middlewares/autenticacion'); //en esta variable importamos la funcion verificaToken

var app = express();

var Usuario = require('../models/usuario'); // importamos la variable Usuario


//================================
//  Obtener todos los usuarios
//================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    // si es ok el mesaje no hace falta la siguente linea
                    usuarios: usuarios
                });

            });

});





//================================
//  Editar usuario
//================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => { // tambien podemos añadir next si lo necesitaramos

    var id = req.params.id;
    var body = req.body;


    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });

        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'usuario con el id ' + id + ' no existe',
                errors: { message: 'no existe usuario con ese ID' }
            });

        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        //   usuario.password = body.password;
        //   usuario.img = body.img;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });

            }

            usuarioGuardado.password = ''; // aqui no mostramos la contraseña

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});


//================================
//  Crear un nuevo usuario
//================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => { // tambien podemos añadir next si lo necesitaramos

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // con este plugin encriptamos la contraseña
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

});

//================================
//  Borrar usuario
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });

        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'id de usuario no encontrado',
                errors: { message: 'id de usuario no encontrado' }
            });

        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


module.exports = app;