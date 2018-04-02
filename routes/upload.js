var express = require('express');

var fileUpload = require('express-fileupload'); // libreria para subir archivos 
var fs = require('fs'); // libreria módulo de administración de archivos "fs" 
//implementa la programación asincrónica para procesar su creación, lectura, modificación, borrado etc.

var app = express();

// con estas variables requerimos campos de las tablas indicadas
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// Opciones Predeterminadas 
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo; // variables cradas para poder crear 
    var id = req.params.id; //  el archivo personalizado al guardarlo

    // tipos de colecciones    

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no es valida',
            errors: { message: 'tipo de coleccion no es valida' }
        });

    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al cargar archivo',
            errors: { message: 'debe selecionar un archivo' }
        });

    }
    //=======================
    // obtener imagen 
    //========================
    var archivo = req.files.imagen;
    // esta variable lo que hace es partir el nombre del archivo  del .extension  ejemp. goku.jpg   pues lo corta en goku y jpg
    var cortarArchivo = archivo.name.split('.');
    // esta variable elige el ultimo tramo del archivo, lo que hay despues del .
    var extensionArchivo = cortarArchivo[cortarArchivo.length - 1]

    //======================================    
    //  elegir que tipo de archivo admitimos
    //=======================================

    var extensionesPermitidas = ['png', 'jpg', 'pdf', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'extension no valida',
            errors: { message: 'las extension validas son' + extensionesPermitidas.join(', ') }
        });


    }

    //======================================    
    //  Nombre de Archivo personalizado
    //  creamos asi el achivo 12345678-123.png de donde el 12345678 es el id de usuario 
    // el 123 es el numero en milisegundos de la fecha actual 
    //=======================================

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //=========================================
    // mover el archivo del temporal a un path
    //=========================================

    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });

        }

        subirPorTipo(tipo, id, nombreArchivo, res);


    })

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no Existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe elemina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                //  no mostramos la contraseña verdadera solo esta :)
                // ya que la variable usuarioActualizado nos mostrara todos los campos de la tabla usuario
                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizada',
                    // aqui mostramos todos los datos de la tabla usuario            
                    usuario: usuarioActualizado
                });

            })

        });

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no Existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // si existe elemina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                medicoActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Medico Actualizada',
                    medico: medicoActualizado
                });

            })

        });

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no Existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe elemina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                //  no mostramos la contraseña verdadera solo esta :)
                // ya que la variable usuarioActualizado nos mostrara todos los campos de la tabla usuario
                hospitalActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Hospital Actualizada',
                    // aqui mostramos todos los datos de la tabla usuario            
                    hospital: hospitalActualizado
                });

            })

        });

    }


}

module.exports = app;