// models/aboutSkill.mongo.js
const mongoose = require('mongoose');

const aboutSkillSchema = new mongoose.Schema({
  skill: { type: String, required: true }
});

module.exports = mongoose.model('AboutSkill', aboutSkillSchema);
