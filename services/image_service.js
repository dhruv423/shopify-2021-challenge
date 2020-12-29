const cloudinary = require("cloudinary");

// models
const User = require("../models/User");
const Image = require("../models/Image");

// Cloudinary Upload
async function uploadAndPersist(path, newFileName, user, options) {
  // Upload to cloudinary
  const uploadedImage = await cloudinary.uploader.upload(path);
  const userImage = await persistImageMetaData(
    newFileName,
    uploadedImage,
    user,
    options
  );
  return userImage;
}

async function persistImageMetaData(newFileName, uploadedImage, user, options) {
  const userImage = new Image({
    name: newFileName,
    link: uploadedImage.url,
    user: user._id,
    public: options.areImagesPublic,
  });
  await userImage.save();
  return userImage;
}

// Handling Error or Success
async function tryUpload(path, newFileName, user, options, response) {
  try {
    const userImage = await uploadAndPersist(path, newFileName, user, options);
    response.results.push(userImage);
  } catch (err) {
    response.errors.push(err.message);
  }
}

async function uploadIfFileDoesNotExist(file, response, user, options) {
  const path = file.path;
  const newFileName = path.replace(/\s/g, ""); // Remove all whitespaces since search in MongoDB doesn't like spaces
  const oldImage = await Image.findOne({ name: newFileName, user: user._id }); // Check if image exists
  if (oldImage) {
    response.errors.push(`${newFileName} already exists`); // Add it to error response
  } else {
    await tryUpload(path, newFileName, user, options, response);
  }
}

async function uploadFiles(files, user, options) {
  let response = {
    results: [],
    errors: [],
  };

  for (const file of files) {
    await uploadIfFileDoesNotExist(file, response, user, options);
  }

  return response;
}

module.exports = { uploadFiles };
