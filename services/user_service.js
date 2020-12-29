const Validator = require("validator");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

async function registerUser(user) {
  const errors = validateRegistration(user);

  if (Object.keys(errors).length !== 0) {
    throw new Error(JSON.stringify(errors));
  }

  const { name, email, password } = user;
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    throw new Error("Email already exists");
  }

  return await persistUser(name, password, email);
}

// Create a new user in the database
async function persistUser(name, password, email) {
  const user = new User({ name, password, email });
  await user.save();
  return destructureUser(user);
}

function destructureUser(user) {
  const { password, ...rest } = JSON.parse(JSON.stringify(user));
  return rest;
}

async function loginUser(userLoginDetails) {
  const { email, password } = userLoginDetails;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email does not exist");
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    throw new Error("Invalid Password");
  }
  const token = await user.generateAuthToken();
  return { token };
}

function validateRegistration(input) {
  let errors = {};
  const { name, email, password, confirmPassword } = input;

  if (!name || !email || !password || !confirmPassword) {
    errors.emptyInput = "Name, Email, Password or Confirm Password is empty.";
  }

  if (!Validator.isEmail(email)) {
    errors.email = "Email is not a valid email";
  }

  if (password.length < 6) {
    errors.passwordLength = "Password must be between at least 6 characters";
  }

  if (!Validator.equals(password, confirmPassword)) {
    errors.password = "Passwords do not match";
  }

  return errors;
}

module.exports = { registerUser, loginUser };
