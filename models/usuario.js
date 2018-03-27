var mongoose = require('mongoose');
// esta libreria es un plugin para poder poner un mensage en el
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USUARIO_ROLE'],
    message: '{VALUE}, el rol no es valido'
};


var usuarioSchema = new Schema({

    nombre: { type: String, require: [true, 'el nombre es necesario'] },
    email: { type: String, unique: true, require: [true, 'el email es necesario'] }, // el email  tiene que ser unico por eso ponemos unique:true
    password: { type: String, require: [true, 'el password es necesario'] },
    img: { type: String, require: false },
    role: { type: String, require: true, default: 'USER_ROLE', enum: rolesValidos } // aqui si no elegimos el rol por defecto le damos el USER_ROLE

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} el correo debe de ser unico' });

// aqui exportamos el esquema usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);