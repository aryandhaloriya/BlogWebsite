const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("./routes/blog-routes");
const router = require("./routes/user-routes");
const cors = require("cors");
require('dotenv/config');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => app.listen(process.env.PORT || 5000))
  .then(() => console.log("Connected to Database and Listening on Port", process.env.PORT || 5000))
  .catch((err) => console.error("Error:", err));
