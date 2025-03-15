const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
      status: "error",
      message: err.message || "Error interno del servidor."
    });
  };
  
  module.exports = errorHandler;