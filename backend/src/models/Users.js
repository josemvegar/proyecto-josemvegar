const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String },
  nick: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "role_user", select: false },
  image: { type: String, default: "default.png" },
  imagePath: { type: String, default: "/uploads/users/default.png" },
  page: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
});

// Método estático para buscar usuarios por email o nick
userSchema.statics.findByEmailOrNick = function (email, nick, page) {
  return this.find({
    $and: [{ $or: [{ email }, { nick }] }, { page }],
  }).exec();
};

userSchema.statics.findUserToLogin = function (login, page) {
  return this.find({$and: [
    {$or: [{email: login}, {nick: login}]},
    {page}
  ]}).select("+password +role").exec();
}

module.exports = model("User", userSchema, "users");
