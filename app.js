const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});
app.use("/", mainRouter);

//  Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  if (err.name === "ValidationError") {
    return res
      .status(400)
      .send({ message: "Validation failed", error: err.message });
  }

  if (err.name === "CastError") {
    return res
      .status(400)
      .send({ message: "Invalid ID format", error: err.message });
  }

  return res
    .status(500)
    .send({ message: "Internal server error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
