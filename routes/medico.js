var express = require('express'); // esta es la libreria de conexion de la base de datos  llamada express

var mdAutenticacion = require('../middlewares/autenticacion'); //en esta variable importamos la funcion verificaToken

var app = express();

var Medico = require('../models/medico'); // importamos la variable Medico de models/medico.js que contiene los campos de la tabla

//================================
//  Obtener todos los Medicos
//================================

app.get('/', (req, res, next) => {

    // la variable desde es para recogervel valor de .limit y añada los siguentes campos
    var desde = req.query.desde || 0;
    desde = Number(desde); // aqui forzamos que la variable desde sea un numero 

    Medico.find({}) // asi solicitamos todos los campos de la tabla medico

    .limit(5) // esta funcion me muestra los 5 primeros registros
        .skip(desde) // estafuncion muestra los siguientes registros
        .populate('usuario', 'nombre email') // esta funcion llamada populate nos carga la tabla usuarios y nos muestra la campos nombre y email de ell
        .populate('hospital') // esta funcion nos carga la tabla hospital con todos sus campos
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        // si es ok el mesaje no hace falta la siguente linea
                        medicos: medicos,
                        total: conteo
                    });


                })

            });

});


//================================
//  Actualizar medico
//================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => { // tambien podemos añadir next si lo necesitaramos

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });

        }
        // si no existe el medico 
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'medico con el id ' + id + ' no existe',
                errors: { message: 'no existe medico con ese ID' }
            });

        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id; // aqui mostramos, requerimos el id del usuario que hace el alta de usuario
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });

            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});

//================================
//  Crear un nuevo medico
//================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
        });

    });

});

//================================
//  Borrar medico
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });

        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'id de medico no encontrado',
                errors: { message: 'id de medico no encontrado' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});

module.exports = app;