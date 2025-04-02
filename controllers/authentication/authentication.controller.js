const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../../models/user.model.js");
const { sendVerificationMail } = require("./verifyemail.controller");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, email, password, profilePicName } = req.body;

    // check if user exists already
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Use different username" });
    }

    // hash password
    const hashPass = await bcrypt.hash(password, 11);
    const emailToken = crypto.randomBytes(64).toString("hex");
    const emailTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    const newUser = new User({
      username,
      email,
      password: hashPass,
      profilePicName,
      emailToken,
      emailTokenExpiry,
    });
    await newUser.save();

    sendVerificationMail(email, emailToken);
    return res.status(201).json({ message: "Verification mail sent" });
  } catch (err) {
    console.error("User creation error: ", err);
    res.status(500).json({ message: `Server error. Please try again later` });
    return;
  }
};

const loginUsernameCheck = async (req, res) => {
  try {
    const { username } = req.body;

    // check if username exists or not
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verified == false) {
      user.emailTokenExpiry = Date.now() + 3600000;
      await user.save();
      sendVerificationMail(user.email, user.emailToken);

      return res
        .status(401)
        .json({ message: "Email not verified, check your email" });
    }
    return res.status(200).json({ message: "User found", userId: user._id });
  } catch (err) {
    console.log(req.body);
    res.status(500).json({ message: `Server error. Please try again later` });
    console.error("User finding error: ", err);
    return;
  }
};

const loginPasswordCheck = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // check if username exists or not
    const user = await User.findById(userId);

    const passMatch = await bcrypt.compare(password, user.password);
    // pass doesnt match
    if (!passMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // password matches
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json({ token: token, profilePicName: user.profilePicName });
  } catch (err) {
    res.status(500).json({ message: `Server error. Please try again later` });
    console.error("User creation error: ", err);
    return;
  }
};

module.exports = { register, loginUsernameCheck, loginPasswordCheck };
