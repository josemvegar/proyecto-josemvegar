const jwt = require('jwt-simple');
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();
const SECRET = process.env.JWT_SECRET;

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
    exp: moment().add(30, 'days').unix(),
  };

  return jwt.encode(payload, SECRET);
};

const renewToken = (token) => {
  const payload = jwt.decode(token, SECRET);
  payload.exp = moment().add(30, 'days').unix();
  return jwt.encode(payload, SECRET);
};

module.exports = {
  SECRET,
  createToken,
  renewToken,
};