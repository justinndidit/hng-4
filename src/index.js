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

app.post("/upload", upload.single("video"), handlePostRequest);
app.post("/uploads", upload.single("video"), async (req, res) => {
  console.log(req.file);
  const videoFile = req.file;
  if (!videoFile) {
    return res.send("no file");
  }
  const path = "uploads/" + videoFile.filename;
  await fs.writeFile(path, videoFile.buffer(), (err) => console.log(err));
  res.status(200).json({ msg: "success" });
});

app.get("/videos/:id", handleGetVideo);
app.get("/videos", handleGetVideos);
app.get("/", (req, res) => {
  res.render("blob");
});

app.post("/uploadBlob", (req, res) => {
  // Handle the Blob data here
  const blobData = req.body;
  console.log(blobData);

  // You can save the Blob data to a file, process it, or store it in a database
  // For demonstration, we're sending a success response with the Blob data
  res.status(200).json({
    message: "Blob data received and processed successfully",
    blobData,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("server"));
