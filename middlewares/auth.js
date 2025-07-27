const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { STATUS_CODES } = require("../utils/constants");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  console.log("🔎 Extracted token:", token);

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload; //  Save token payload to request
    next(); //  Proceed to next middleware or route handler
  } catch (err) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: "Invalid or expired token" });
  }
};
