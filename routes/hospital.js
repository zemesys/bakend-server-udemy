var express = require('express');

//en esta variable importamos la funcion verificaToken
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// importamos la variable Hospital de models/hospital.js
var Hospital = require('../models/hospital');


//================================
//  Obtener todos los Hospitales
//================================

app.get('/', (req, res, next) => {

    // la variable desde es para recogervel valor de .limit y añada los siguentes campos
    var desde = req.query.desde || 0;
    desde = Number(desde); // aqui forzamos que la variable desde sea un numero

    Hospital.find({}) // asi solicitamos todos los campos de la tabla hospitales
        .skip(desde)
        .limit(5) // esta funcion me muestra los 5 primeros registros
        .populate('usuario', 'nombre email') // esta funcion llamada populate nos carga la tabla usuarios y nos muestra la campos nombre y email de ella
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        // si es ok el mesaje no hace falta la siguente linea
                        hospitales: hospitales,
                        total: conteo
                    });

                })


            });

});


//================================
//  Actualizar Hospital
//================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => { // tambien podemos añadir next si lo necesitaramos

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });

        }
        // si no existe el hospital 
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'hospital con el id ' + id + ' no existe',
                errors: { message: 'no existe hospital con ese ID' }
            });

        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id; // aqui mostramos, requerimos el id del usuario de la tabla usuarios

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });

            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});

//================================
//  Crear un nuevo Hospital
//================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
        });

    });

});

//================================
//  Borrar hospital
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });

        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'id de hospital no encontrado',
                errors: { message: 'id de hospital no encontrado' }
            });

        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});

module.exports = app;