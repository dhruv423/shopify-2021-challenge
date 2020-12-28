const express = require("express");
const Validator = require("validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../models/User");

// Creates an user account in the database and on success it returns
// the user object else returns error
router.post("/register", async (req, res) => {
  const errors = validateRegistration(req.body);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).send(errors);
  }

  const { name, email, password } = req.body;
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(409).send({ error: "Email already exists" });
  }

  // Create a new user
  try {
    const user = new User({ name, password, email });
    await user.save();
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Login with created account and returns user object and JWT token valid for 2 hours
// Must use the JWT token for image endpoints
// Upon error returns error
router.post("/login", async (req, res) => {
  console.log(req.user);

  // Login a registered user
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: "Email does not exist" });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.status(401).send({ error: "Invalid Password" });
    }
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Function for validating the registration input
function validateRegistration(input) {
  let errors = {};
  const { name, email, password, confirmPassword } = input;

  if (!name || !email || !password || !confirmPassword) {
    errors.emptyInput = "Name, Email, Password or Confirm Password is empty.";
  }

  if (!Validator.isEmail(email)) {
    errors.email = "Email is not a valid email";
  }

  if (!password.length >= 6) {
    errors.password = "Password must be between at least 6 characters";
  }

  if (!Validator.equals(password, confirmPassword)) {
    errors.password = "Passwords do not match";
  }

  return errors;
}

module.exports = router;
