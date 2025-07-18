const router = require("express").Router();

const clothingItem = require("./clothingItems");
router.use("/items", clothingItem);

const userRouter = require("./users");
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
