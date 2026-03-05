const express = require("express");
const Project = require("../models/project.mongo");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();


// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio_projects",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });


// ================= ADD PROJECT =================
router.post("/add", upload.single("image"), async (req, res) => {
  try {

    const { title, description, techstack, github, live } = req.body;

    const newProject = new Project({
      title,
      description,
      techstack,
      github,
      live,
      image: req.file ? req.file.path : "", // Cloudinary URL
    });

    await newProject.save();

    res.redirect("/admin/interface#existing-project");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding project");
  }
});


// ================= DELETE PROJECT =================
router.post("/delete/:id", async (req, res) => {
  try {

    await Project.findByIdAndDelete(req.params.id);

    res.redirect("/admin/interface#existing-project");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting project");
  }
});


// ================= EDIT PROJECT =================
router.post("/edit/:id", upload.single("image"), async (req, res) => {
  try {

    const data = {
      title: req.body.title,
      description: req.body.description,
      techstack: req.body.techstack,
      github: req.body.github,
      live: req.body.live,
    };

    if (req.file) {
      data.image = req.file.path; // Cloudinary URL
    }

    await Project.findByIdAndUpdate(req.params.id, data);

    res.redirect("/admin/interface#existing-project");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating project");
  }
});

module.exports = router;