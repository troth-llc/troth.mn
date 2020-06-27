const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http").Server(app);
const io = require("socket.io")(http);
require("dotenv").config();
const PORT = process.env.PORT;
const mongodb = process.env.MONGO;
const path = require("path");
if (process.env.DEV == "false")
  app.use(express.static(path.join(__dirname, "/client/build")));
app.use(express.json());
// call routes
app.set("io", io);
app.use("/api", require("./src/routes"));
if (process.env.DEV == "false")
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname + "/client/build/index.html"))
  );
http.listen(PORT, () => {
  mongoose
    .connect(mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
  mongoose.set("useCreateIndex", true);
  console.log(`server running on the port: ${PORT}`);
});
