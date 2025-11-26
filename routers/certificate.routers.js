const express = require("express");
const multer = require("multer");
const path = require("path");
const Certificate = require("../models/certificate.mongo");
const router = express.Router();

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Display all certificates
router.get("/", async (req, res) => {
  try {
    const certificate = await Certificate.find();
    res.render("certificate", { certificate });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading certificates");
  }
});

// Add certificate
router.post("/add", upload.single("images"), async (req, res) => {
  try {
    const newCert = new Certificate({ Name: req.body.Name, image: req.file.filename });
    await newCert.save();
    res.redirect("/admin/interface");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading certificate");
  }
});

// Delete certificate
router.post("/remove", async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.body.id);
    res.redirect("/admin/interface");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting certificate");
  }
});

module.exports = router;
