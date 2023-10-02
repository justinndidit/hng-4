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
app.use(express.static("./upload"));
// app.set("view engine", "ejs");
// app.set("views", join(__dirname, "views"));

app.post(
  "/upload",
  upload.single("video"),
  handlePostRequest
);
app.post(
  "/uploads",
  upload.single("video"),
  async (req, res) => {
    console.log(req.file);
    const videoFile = req.file;
    if (!videoFile) {
      return res.send("no file");
    }
    const path = "uploads/" + videoFile.filename;
    await fs.writeFile(path, videoFile.buffer(), (err) =>
      console.log(err)
    );
    res.status(200).json({ msg: "success" });
  }
);

app.get("/videos/:id", handleGetVideo);
app.get("/videos", handleGetVideos);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log("server"));
