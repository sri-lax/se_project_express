const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { STATUS_CODES } = require("./utils/constants");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch((e) => console.error(e));

app.use(cors());
app.use(express.json());

// Protected routes
app.use("/", mainRouter);

//  Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  if (err.name === "ValidationError") {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: "Validation failed", error: err.message });
  }

  if (err.name === "CastError") {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: "Invalid ID format", error: err.message });
  }

  return res
    .status(STATUS_CODES.DEFAULT)
    .send({ message: "Internal server error", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
