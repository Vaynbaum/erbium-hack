const express = require("express");
const multer = require("multer");
const cors = require("cors");

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilt = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const app = express();
const upload = multer({
  storage: storageConfig,fileFilter: fileFilt
})

app.use(cors());
app.use(express.static('static'));

app.post("/", upload.single("file"), (req, res) => {
  return res.send(req.file.filename);
});

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})