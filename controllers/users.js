const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { STATUS_CODES } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        email,
        password: hashedPassword,
        name,
        avatar,
      })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(STATUS_CODES.CREATED).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error("Create User Error:", err);

      if (err.code === 11000) {
        return res
          .status(STATUS_CODES.CONFLICT)
          .send({ message: "Email already exists" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid user data" });
      }

      return res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Internal server error" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      return res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Invalid user ID format" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(STATUS_CODES.OK).send({ token });
    })
    .catch((err) => {
      console.error("Login Error:", err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }

      return res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Internal server error" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((updatedUser) => res.status(STATUS_CODES.OK).send(updatedUser))
    .catch((err) => {
      console.error("Update User Error:", err);

      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid profile data" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }

      return res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Internal server error" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
