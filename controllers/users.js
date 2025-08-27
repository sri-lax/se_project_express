const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { STATUS_CODES } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ email, password: hashedPassword, name, avatar })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(new InternalServerError("Error creating user"));
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Invalid email or password"));
      }
      return next(new InternalServerError("Login failed"));
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("User not found"))
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid profile data"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
