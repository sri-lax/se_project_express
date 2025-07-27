const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES } = require("../utils/constants");

const createItem = (req, res) => {
  console.log("Request body:", req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(STATUS_CODES.CREATED).send({ data: item }))
    .catch((err) => {
      console.error("Create Error:", err);
      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item data", error: err.message });
      }
      return res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Error from createItem", error: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS_CODES.OK).send(items))
    .catch((err) => {
      console.error("Get Error:", err);
      res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "GetItem Failed", error: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  console.log("Update:", itemId, imageUrl);

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(STATUS_CODES.OK).send({ data: item }))
    .catch((err) => {
      console.error("Update Error:", err);
      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid update data", error: err.message });
      }
      return res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Error from updateItem", error: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new Error("Item not found"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(STATUS_CODES.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item." });
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.sendStatus(204)
      );
    })
    .catch((err) => {
      console.error("Delete Error:", err);

      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID format", error: err.message });
      }

      if (err.message === "Item not found") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found", error: err.message });
      }

      res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Error from deleteItem", error: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(STATUS_CODES.OK).send({ data: item }))
    .catch((err) => {
      console.error("Like Error:", err);

      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID format", error: err.message });
      }

      if (err.message === "Item not found") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found", error: err.message });
      }

      return res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Error from likeItem", error: err.message });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(STATUS_CODES.OK).send({ data: item }))
    .catch((err) => {
      console.error("Unlike Error:", err);

      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID format", error: err.message });
      }

      if (err.message === "Item not found") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found", error: err.message });
      }

      return res
        .status(STATUS_CODES.DEFAULT)
        .send({ message: "Error from unlikeItem", error: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
