const mongoose = require("mongoose");

// Image model
const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  link: {
      type: String,
      required: true,
  },
  public: {
      type: Boolean,
      default: false,
  }
});


const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
