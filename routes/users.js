const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

// Route to get the logged-in user's data
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
