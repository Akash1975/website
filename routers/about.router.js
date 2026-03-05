// routers/about.router.js

const express = require("express");
const router = express.Router();
const About = require("../models/about.mongo");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio_about_images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// UPDATE ABOUT (WITH IMAGE)
router.post("/admin/about/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { paragraph1, paragraph2, paragraph3, title } = req.body;

    const updateData = {
      paragraph1,
      paragraph2,
      paragraph3,
      title,
    };

    // If image uploaded
    if (req.file) {
      updateData.image = req.file.path; // Cloudinary image URL
    }

    await About.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.redirect("/admin/interface#edit-about");
  } catch (err) {
    console.error("Error updating about:", err);
    res.status(500).send("Error updating about");
  }
});

// GET ABOUT API
router.get("/api/about", async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({});
    }

    res.json(about);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;