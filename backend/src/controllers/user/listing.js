const UserService = require("../../services/userService");

const list = async (req, res) => {
    
    try {

        let paginationPage= req.params.page;
        if (!paginationPage) paginationPage= 1;

        // Llama al servicio de usuarios para manejar la edición.
        const result = await UserService.list(req.user.page, paginationPage);

        // Si el servicio devuelve un error, envía la respuesta correspondiente.
        if (result.status === "error") {
            return res.status(result.code).send(result.response);
        }

        // Si el inicio de sesión es exitoso, envía una respuesta con el usuario y el token.
        return res.status(200).send({
            status: "success",
            message: "listado de usuarios.",
            ...result.response
        });
    } catch (error) {
        // Si ocurre un error inesperado, registra el error y envía una respuesta genérica.
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Error al listar usuarios."
        });
    }

}

const one = async (req, res) => {
    
    try {

        let id= req.params.id;
        const page = req.user ? req.user.page : 'role_client';

        if (!id && !req.user) {
            return res.status(400).send({
                status: 'error',
                message: 'Ingresa un id de usuario válido.'
            })
        }else if (!id && req.user) {
            id = req.user.id;
        }

        // Llama al servicio de usuarios para manejar la edición.
        const result = await UserService.list(page, undefined, id);

        // Si el servicio devuelve un error, envía la respuesta correspondiente.
        if (result.status === "error") {
            return res.status(result.code).send(result.response);
        }

        // Si el inicio de sesión es exitoso, envía una respuesta con el usuario y el token.
        return res.status(200).send({
            status: "success",
            ...result.response
        });
    } catch (error) {
        // Si ocurre un error inesperado, registra el error y envía una respuesta genérica.
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Error al listar usuario."
        });
    }

}

module.exports = {
    list,
    one
}