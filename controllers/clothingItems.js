const ClothingItem = require("../models/clothingItem");
// const {
//   BadRequestError,
//   ForbiddenError,
//   NotFoundError,
//   InternalServerError,
// } = require("../utils/errors");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/NotFoundError");
const InternalServerError = require("../utils/errors/InternalServerError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Invalid item data"));
      }
      return next(new InternalServerError("Error creating item"));
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((error) =>
      next(new InternalServerError(`Failed to fetch items: ${error.message}`))
    );
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res
          .status(200)
          .send({ message: "Item successfully deleted", data: itemId })
      );
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(error);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(error);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(error);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
