const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


// Before saving the user object to the database, encrypt the password
userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Generate JWT token bassed on user ID which expires in 2 hours
userSchema.methods.generateAuthToken = async function() {
    // Generate an JWT token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY, { expiresIn: '2h' })
    return token
}

const User = mongoose.model("User", userSchema);

module.exports = User;
