// routers/aboutSkill.router.js
const express = require('express');
const router = express.Router();
const AboutSkill = require('../models/aboutSkill.mongo');

// Add a new about skill
router.post('/admin/about/skills/add', async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(400).send('Skill is required');
    }
    await AboutSkill.create({ skill });
    res.redirect('/admin/interface');
  } catch (err) {
    console.error('Error adding about skill:', err);
    res.status(500).send('Server error');
  }
});

// Update about skill
router.post('/admin/about/skills/edit/:id', async (req, res) => {
  try {
    const { skill } = req.body;
    await AboutSkill.findByIdAndUpdate(req.params.id, { skill }, { new: true });
    res.redirect('/admin/interface');
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).send('Server error');
  }
});

// Delete about skill
router.post('/admin/about/skills/delete/:id', async (req, res) => {
  try {
    await AboutSkill.findByIdAndDelete(req.params.id);
    res.redirect('/admin/interface');
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
