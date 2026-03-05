const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.mongo");
const checkAdmin = require("../middleware/checkadmin");

const router = express.Router();

router.post("/admin/create-user", checkAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.redirect("/admin/interface#users");
  } catch (error) {
    console.error(error);
    res.send("Error creating user");
  }
});

router.post("/admin/delete-user/:id", checkAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.redirect("/admin/interface#users");
  } catch (error) {
    console.error(error);
    res.send("Error deleting user");
  }
});

module.exports = router;
