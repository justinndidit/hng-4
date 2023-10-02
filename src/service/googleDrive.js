const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: process.env.RESFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

module.exports = {
  drive,
};
