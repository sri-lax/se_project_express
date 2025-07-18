const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log("Request body:", req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error("Create Error:", err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Invalid item data", error: err.message });
      }
      return res
        .status(500)
        .send({ message: "Error from createItem", error: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error("Get Error:", err);
      res.status(500).send({ message: "GetItem Failed", error: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  console.log("Update:", itemId, imageUrl);

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error("Update Error:", err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Invalid update data", error: err.message });
      }
      return res
        .status(500)
        .send({ message: "Error from updateItem", error: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => new Error("Item not found"))
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error("Delete Error:", err);
      res
        .status(500)
        .send({ message: "Error from deleteItem", error: err.message });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
