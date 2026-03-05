const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Certificate = require("../models/certificate.mongo");

const router = express.Router();

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio_certificates",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// ============================
// Show Certificates Page
// ============================
router.get("/", async (req, res) => {
  try {
    const certificate = await Certificate.find();
    res.render("certificate", { certificate });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading certificates");
  }
});

// ============================
// Add Certificate
// ============================
router.post("/add", upload.single("images"), async (req, res) => {
  try {
    if (!req.file) {
      return res.send("No file uploaded");
    }

    const newCert = new Certificate({
      Name: req.body.Name,
      image: req.file.path, // Cloudinary image URL
    });

    await newCert.save();

    res.redirect("/admin/interface");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading certificate");
  }
});

// ============================
// Delete Certificate
// ============================
router.post("/remove", async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.body.id);
    res.redirect("/admin/interface#cert-list");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting certificate");
  }
});

module.exports = router;
