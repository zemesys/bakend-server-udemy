var mongoose = require('mongoose');
// esta libreria es un plugin para poder poner un mensage en el
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USUARIO_ROLE'],
    message: '{VALUE}, el rol no es valido'
};


var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'el nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'el email es necesario'] }, // el email  tiene que ser unico por eso ponemos unique:true
    password: { type: String, required: [true, 'el password es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }, // aqui si no elegimos el rol por defecto le damos el USER_ROLE
    google: { type: Boolean, required: false, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} el correo debe de ser unico' });

// aqui exportamos el esquema usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);