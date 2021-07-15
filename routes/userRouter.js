require("dotenv").config();
const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { hasRole } = require("../middleware/rbac");

router.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password, mobile, roleId } = req.body;
    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !mobile ||
      !roleId
    ) {
      return res.status(400).json({
        message: "Please add all the details",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be 6 characters long",
      });
    }
    const user_email = await User.findOne({ email });
    if (user_email) {
      return res.status(400).json({ message: "This email is already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      first_name,
      last_name,
      email,
      mobile,
      roleId,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "Signup successfully", data: user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please add email" });
    }
    if (!password) {
      return res.status(400).json({ message: "Please add password" });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    res.status(200).json({
      message: "Login successfully",
      data: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        roleId: user.roleId,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/all", hasRole("user-get"), async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/:id", hasRole("user-get"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router; 
