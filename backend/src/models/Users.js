// Importar dependencias
const {Schema, model} = require("mongoose");

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        default: "role_user",
        select: false
    },
    image: {
        type: String,
        default: "default.png"
    },
    imagePath: {
        type: String,
        default: "/uploads/users/default.png"
    },
    page: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
});

module.exports = model("User", userSchema, "users");