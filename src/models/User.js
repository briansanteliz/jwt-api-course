const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "Ingrese un email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Ingrese un email valido"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Ingrese un password"],
    minlength: [6, "El password debe tener una longitud de 6 caracteres"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("El Password es incorrecto");
  }
  throw Error("El Email es  incorrecto");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
