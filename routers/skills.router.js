const express = require("express");
const Skill = require("../models/skills.mongo");
const router = express.Router();

// Display all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.render("skill", { skills });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading skills");
  }
});

// Add skill
router.post("/add", async (req, res) => {
  try {
    const newSkill = new Skill({ name: req.body.name });
    await newSkill.save();
    res.redirect("/admin/interface");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding skill");
  }
});

// Delete skill
router.post("/remove", async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.body.id);
    res.redirect("/admin/interface");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting skill");
  }
});

module.exports = router;
