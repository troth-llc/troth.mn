const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const mongodb = process.env.MONGO;
app.use(express.json());
// call routes
app.use("/api", require("./src/routes"));
app.listen(PORT, () => {
  mongoose
    .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));
  mongoose.set("useCreateIndex", true);
  console.log(`server running on the port: ${PORT}`);
});
