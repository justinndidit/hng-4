const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    kind: String,
    id: String,
    name: String,
    mimeType: String,
    webContentLink: String,
    webViewLink: String,
  },
  {
    timeStamps: true,
  }
);

const File = mongoose.model("file", fileSchema);

module.exports = {
  File,
};
