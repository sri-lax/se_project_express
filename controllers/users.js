const User = require("../models/user");
const { STATUS_CODES } = require("../utils/constants");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_CODES.OK).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(STATUS_CODES.DEFAULT).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(STATUS_CODES.CREATED).send(user))
    .catch((err) => {
      console.error("Create User Error:", err);
      next(err);
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
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
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: "Invalid user ID format" });
    });
};

module.exports = { getUsers, createUser, getUser };
