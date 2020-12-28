const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./api/user_service");
const images = require("./api/image_service");
require("dotenv").config({ path: ".env" }); // allows use of .env file
const cloudinary = require("cloudinary").v2; // image repository

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// MongoDB Connection Options
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// Connect to MongoDB Database
mongoose
  .connect(process.env.MONGODB_URI, connectionOptions)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => console.log(err));

// API Routes
app.use("/user", users);
app.use("/image", images);

// Connect to Cloudinary repository
cloudinary.config({
  cloud_name: "dwddpd7jx",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));

module.exports = app;
