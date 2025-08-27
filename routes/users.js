const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserBody } = require("../middlewares/validation");

// Route to get the logged-in user's data
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserBody, updateUser);

module.exports = router;
