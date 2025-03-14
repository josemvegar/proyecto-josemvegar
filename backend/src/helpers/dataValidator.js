const validator = require("validator");

const dataValidator = (data) => {

    let reasons = [];

    if(data.name){
        if(!validator.isLength(data.name, {min: 3, max: undefined}) || !validator.isAlpha(data.name, "es-ES")){
            reasons.push("El nombre debe ser de mínimo 3 caracteres.");
        }
    }

    if(data.surname){
        if(!validator.isLength(data.surname, {min: 3, max: undefined}) || !validator.isAlpha(data.surname, "es-ES")){
            reasons.push("El apellido debe ser de mínimo 3 caracteres.");
        }
    }

    if(data.nick){
        if(!validator.isLength(data.nick, {min: 3, max: undefined}) || !validator.isAlpha(data.nick, "es-ES")){
            reasons.push("El nombre de usuario debe ser de mínimo 3 caracteres.");
        }
    }

    if(data.email){
        if(!validator.isEmail(data.email)){
            reasons.push("El correo es inválido.");
        }
    }

    if(data.password){
        if(!validator.isLength(data.password, {min: 8, max: undefined}) || !validator.isStrongPassword(data.password)){
            reasons.push("La contraseña debe ser una contraseña fuerte.");
        }
    }

    if(data.role){
        const allowedRoles = ["role_admin", "role_user"];
        if (!allowedRoles.includes(data.role)){
            reasons.push("El rol indicado no cumple con lo esperado.");
        }
    }

    if(data.image){
        if(!validator.isAlpha(data.image)){
            reasons.push("El nombre de la imagen no es una cadena.");
        }
    }

    if(data.imagePath){
        if(!validator.isAlpha(data.imagePath)){
            reasons.push("El path de la imagen no es una cadena.");
        }
    }

    if(data.created_at){
        if(!validator.isDate(data.created_at)){
            reasons.push("La fecha no es formato adecuado.");
        }
    }


    if (reasons.length > 0){
        return reasons;
    }

    return true
}

module.exports = {
    dataValidator
}