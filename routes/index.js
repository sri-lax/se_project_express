const router = require("express").Router();
const { STATUS_CODES } = require("./utils/constants");

const clothingItem = require("./clothingItems");

router.use("/items", clothingItem);

const userRouter = require("./users");

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
