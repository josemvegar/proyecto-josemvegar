const UserService = require("../../services/userService");

const update = async (req, res) => {

    // Extrae los datos del cuerpo de la solicitud.
    const data = req.body;
    let id = req.params.id;

    if (!id) id=req.user.id;
    
    try {
        // Llama al servicio de usuarios para manejar la edición.
        const result = await UserService.update(id, req.user, data);

        // Si el servicio devuelve un error, envía la respuesta correspondiente.
        if (result.status === "error") {
            return res.status(result.code).send(result.response);
        }

        // Si el inicio de sesión es exitoso, envía una respuesta con el usuario y el token.
        return res.status(200).send({
            status: "success",
            message: "Usuario editado.",
            ...result.response
        });
    } catch (error) {
        // Si ocurre un error inesperado, registra el error y envía una respuesta genérica.
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Error al editar usuario."
        });
    }

}

module.exports = {
    update
}
