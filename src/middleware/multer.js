const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
// Instantiate a storage client
const storage = new Storage({
  keyFilename: path.join(__dirname, "../../google-service.json"),
  projectId: process.env.GCLOUD_ID,
});
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // no larger than 50mb
  },
});
// var config = require();
const bucket = storage.bucket("troth_bucket");
module.exports = { multer, bucket };
