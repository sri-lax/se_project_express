const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");
const NotFoundError = require("../utils/errors/NotFoundError");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLogin, login);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
