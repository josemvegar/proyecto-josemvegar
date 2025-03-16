const { dataValidator } = require('../helpers/dataValidator');
const emptyChecker = require('../helpers/emptyChecker');

const validateUser = (req, res, next) => {
  const data = req.body;
  const empty = emptyChecker(data, ["name", "nick", "email", "password", "role", "page"]);
  if (empty !== true) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos.",
      empty
    });
  }

  const validation = dataValidator(data);
  if (validation !== true) {
    return res.status(400).send({
      status: "error",
      message: "Validación no pasada.",
      reasons: validation
    });
  }

  next();
};

const loginValidator = (req, res, next) => {
  const data = req.body;
  const empty = emptyChecker(data, ["login","password", "page"]);
  if (empty !== true) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos.",
      empty
    });
  }
  next();
};

module.exports = {
  validateUser,
  loginValidator
};