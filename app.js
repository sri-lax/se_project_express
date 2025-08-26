require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const { STATUS_CODES } = require("./utils/constants");
const mainRouter = require("./routes/index");

const { PORT = 3001, MONGO_URI } = process.env;
const app = express();

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI in environment variables");
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error("MongoDB connection error:", e));

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack || err);

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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});
