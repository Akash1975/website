const express = require("express");
const Project = require("../models/project.mongo");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ADD PROJECT
router.post("/add", upload.single("image"), async (req, res) => {
  const { title, description, techstack, github, live } = req.body;

  const newProject = new Project({
    title,
    description,
    techstack,
    github,
    live,
    image: req.file ? req.file.filename : "default.png",
  });

  await newProject.save();
  res.redirect("/admin/interface");
});

// DELETE PROJECT
router.post("/delete/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.redirect("/admin/interface");
});

// EDIT PROJECT
router.post("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      techstack: req.body.techstack,
      github: req.body.github,
      live: req.body.live,
    };
    if (req.file) data.image = req.file.filename;
    await Project.findByIdAndUpdate(req.params.id, data);
    res.redirect("/admin/interface");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating project");
  }
});

module.exports = router;
