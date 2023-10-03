const express = require("express");
const app = express();
require("dotenv").config();
const { connectDB } = require("./config/dbConnection");
const { upload } = require("./config/multer");
const {
  handlePostRequest,
  handleGetVideo,
  handleGetVideos,
} = require("./controller");
const { join } = require("path");
const fs = require("fs");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "..", "upload")));
// app.set("view engine", "ejs");
// app.set("views", join(__dirname, "views"));

app.post("/upload", upload.single("video"), handlePostRequest);

app.get("/videos/:id", handleGetVideo);
app.get("/videos", handleGetVideos);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log("server"));
