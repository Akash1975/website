const Skill = require("./skills.mongo");

const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.render('home', { skills });   // ✅ lowercase file name + correct variable
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading skills");
  }
};

const addSkill = async (req, res) => {
  try {
    const { name } = req.body;
    const newSkill = new Skill({ name });
    await newSkill.save();
    res.status(201).json({ message: "Skill added successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding skill");
  }
};

const removeSkill = async (req, res) => {
  try {
    const { id } = req.body;
    await Skill.findByIdAndDelete(id);
    res.status(200).json({ message: "Skill deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting skill");
  }
};

module.exports = {
  getAllSkills,
  addSkill,
  removeSkill,
};
