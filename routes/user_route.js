const express = require("express");
const router = express.Router();
require("dotenv").config();

const User = require("../models/User");
const UserService = require("../services/user_service");

// Creates an user account in the database and on success it returns
// the user object else returns error
router.post("/register", async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Login with created account and returns user object and JWT token valid for 2 hours
// Must use the JWT token for image endpoints
// Upon error returns error
router.post("/login", async (req, res) => {
  // Login a registered user
  try {
    const token = await UserService.loginUser(req.body);
    res.status(200).send(token);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
