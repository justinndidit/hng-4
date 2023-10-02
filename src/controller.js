const { File } = require("./model/fileModel");
const fs = require("fs");
const path = require("path");
const { drive } = require("./service/googleDrive");

const handlePostRequest = async (req, res) => {
  try {
    const file = await drive.files.create({
      requestBody: {
        name: req.file.filename,
        mimeType: req.file?.mimetype,
      },
      media: {
        mimeType: req.file?.mimetype,
        body: fs.createReadStream(
          path.join(__dirname, "upload", req.file.filename)
        ),
      },
    });

    const fileId = file.data.id;

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    const mergedData = { ...result.data, ...file.data };
    console.log(mergedData);
    await fs.unlink(
      path.join(__dirname, "upload", req.file.filename),
      async () => {
        const mongoFile = await File.create(mergedData);
        res.status(200).json({
          ok: true,
          mongoFile,
          redirect: true,
          redirectUrl: `/videos/${mongoFile._id}`,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

const handleGetVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const videoFile = await File.findOne({ _id: id });
    if (!videoFile) {
      return res.status(404).json({
        ok: false,
        message: "video not found",
        redirect: false,
        redirectUrl: "",
      });
    }

    res.status(200).json({
      ok: true,
      videoFile,
      redirect: false,
      redirectUrl: "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

const handleGetVideos = async (req, res) => {
  try {
    const videoFiles = await File.find();
    if (!videoFiles) {
      return res.status(404).json({
        ok: false,
        message: "Videos not found",
        redirect: false,
        redirectUrl: "",
      });
    }
    if (videoFiles.length < 1) {
      return res.status(200).json({
        ok: true,
        message: "No video have been Recorded",
        redirect: false,
        redirectUrl: "",
      });
    }

    res.status(200).json({
      ok: true,
      videoFiles,
      redirect: false,
      redirectUrl: "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

module.exports = {
  handlePostRequest,
  handleGetVideo,
  handleGetVideos,
};
