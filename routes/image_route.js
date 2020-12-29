const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const ImageService = require("../services/image_service");

// multer upload
const imageUpload = require("../helpers/upload");

// Returns a response that contains results and errors
router.post("/upload", imageUpload.array("images"), async (req, res) => {
  try {
    const user = jwt.verify(req.body.JWTToken, process.env.JWT_KEY);
    const areImagesPublic = req.body.isPublic || false; // Permissions for images, defaults to false if not passed

    let options = {
      areImagesPublic,
    };

    const response = await ImageService.uploadFiles(req.files, user, options);

    // Adjust http response code
    if (response.errors.length !== 0) {
      return res.status(400).send(response);
    }
    return res.status(200).send(response);
  } catch (err) {
    // Adjust error code for Unauthorized
    if (err.name.includes("Token")) {
      return res.status(401).send(err);
    }
    return res.status(400).send(err);
  }
});

module.exports = router;
