var jwt = require('jsonwebtoken'); // libreria para el token

var SEED = require('../config/config').SEED; // importamos la variable SEED


//================================
//  verificar token
//================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decode.usuario;

        next();
    });
}