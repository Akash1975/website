const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techstack: { type: String },
    github: { type: String },
    live: { type: String },
    image: { type: String, default: "default.png" },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Project", projectSchema);
