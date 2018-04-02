var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//========================================
// Busqueda Parcial 
//========================================
app.get('/coleccion/:tabla/:busqueda', (req, res, ) => {

    var busqueda = req.params.busqueda; //la variable busqueda  requiere los parametros de la variable busqueda
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i'); // la variable regex "expresion regular" se utiliza 
    // para que la busqueda sea insensible a mayusculas y minusculas y viene determinadacon la lera i 
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda solo son : medicos, hospitales, usuarios ',
                error: { message: 'tipo de tabla/colencion no es valido ' }
            });
    }

    promesa.then(data => {
        return res.status(400).json({
            ok: true,
            [tabla]: data
        });

    })
});



//==========================================
// Busqueda General 
//==========================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); // la variable regex "expresion regular" se utiliza 
    // para que la busqueda sea insensible a mayusculas y minusculas y viene determinadacon la lera i 

    // con esta promesa buscamos cualquier palabra en las tablas medico y hospitales
    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuesta => {

            res.status(200).json({
                ok: true,
                hospitales: respuesta[0],
                medicos: respuesta[1],
                usuarios: respuesta[2]
            });


        })

});
// con esta funcion llamada buscarHospitales hacemos una busqueda general para los hospitales
function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email') // esta funcion populate muestra en esta busqueda, 
            .exec((err, hospitales) => { //  tambien la tabla usuario, los campos nombre y email 

                if (err) {
                    reject('error al cargar hospitales', err);
                } else {
                    resolve(hospitales)
                }
            });
    });

}

// con esta funcion llamada buscarMedicos hacemos una busqueda general para los Medicos
function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex }, (err, medicos) => {

            if (err) {
                reject('error al cargar medicos', err);
            } else {
                resolve(medicos)
            }


        });
    });

}

// con esta funcion llamada buscarUsuarios hacemos una busqueda general para los Usuarios
function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role') // aqui decido que campos muestro 
            .or([{ 'nombre': regex }, { 'email': regex }]) // la funcion or decide por que campos hago la busqueda
            .exec((err, usuarios) => { // es usuarios por que regresa varios campos
                if (err) {
                    reject('error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }




            })
    });
}

module.exports = app;