const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
