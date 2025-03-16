// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Definir clave secreta
const dotenv = require('dotenv');
dotenv.config();
const SECRET = process.env.JWT_SECRET;

// Función para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    return jwt.encode(payload, SECRET);

};

// Exportar módulo
module.exports = {
    SECRET,
    createToken
};