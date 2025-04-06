const UserService = require("../../services/userService");

const _delete = async (req, res) => {
    
    try {

        const id= req.params.id;

        // Llama al servicio de usuarios para manejar la edición.
        const result = await UserService._delete(id, req.user);

        // Si el servicio devuelve un error, envía la respuesta correspondiente.
        if (result.status === "error") {
            return res.status(result.code).send(result.response);
        }

        // Si el inicio de sesión es exitoso, envía una respuesta con el usuario y el token.
        return res.status(200).send({
            status: "success",
            message: "Usuario eliminado.",
            ...result.response
        });
    } catch (error) {
        // Si ocurre un error inesperado, registra el error y envía una respuesta genérica.
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar usuario."
        });
    }

}

module.exports = {
    _delete
}