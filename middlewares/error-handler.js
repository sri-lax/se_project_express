module.exports = (err, req, res, next) => {
  console.error("🔥 Error:", err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).send({ message });
};
