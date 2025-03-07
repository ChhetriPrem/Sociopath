const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dyfxlm5un",
  api_key: "125477939287617",
  api_secret: "5OjoS5t3AAoLkmx-23v59BCPfzI",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    format: async () => {
      "png";
    },
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
