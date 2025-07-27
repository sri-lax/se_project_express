const router = require("express").Router();
const { STATUS_CODES } = require("../utils/constants");
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
