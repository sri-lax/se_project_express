const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { STATUS_CODES } = require("../utils/constants");
const { UnauthorizedError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("🔐 Verified token payload:", payload);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};
