const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

// models
const User = require("../models/User");
const Image = require("../models/Image");

// multer upload
const imageUpload = require("../helpers/upload");

// Upload one image or multiple images at once
// The key of the images must be "images" in the form data
// Requires JWT Token to passed in the form data
// Optional: isPublic key to allow images to be public, defaults to false if not passed
// Returns a response that contains results and errors
router.post("/upload", imageUpload.array("images"), async (req, res) => {
  try {
    const user = jwt.verify(req.body.JWTToken, process.env.JWT_KEY);
    const areImagesPublic = req.body.isPublic || false; // Permissions for images, defaults to false if not passed

    var response = {
      results: [],
      errors: [],
    };

    for (const file of req.files) {
      const path = file.path;
      const newFileName = path.replace(/\s/g, ""); // Remove all whitespaces since find in MongoDB doesn't like spaces
      const oldImage = await Image.findOne({ name: newFileName }); // Check if image exists
      if (oldImage) {
        response.errors.push(`${newFileName} already exists`); // Add it to error response
        continue; // Move on to next file
      }

      try {
        // Upload to cloudinary
        const uploadedImage = await cloudinary.uploader.upload(path);
        const userImage = new Image({
          name: newFileName,
          link: uploadedImage.url,
          user: user._id,
          public: areImagesPublic,
        });
        await userImage.save();
        response.results.push(userImage);
      } catch (err) {
        response.errors.push(err.message);
      }
    }

    // Adjust http response code
    if (response.errors.length !== 0) {
      return res.status(500).send(response)
    }
    return res.status(200).send(response)

  } catch (err) {
    // Adjust error code for Unauthorized
    if (err.name.includes('Token')) {
      return res.status(401).send(err);
    }
    return res.status(400).send(err);
  }
});

module.exports = router;
