const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
  title: { type: String, default: "About Me" },
  paragraph1: { type: String, default: "" },
  paragraph2: { type: String, default: "" },
  paragraph3: { type: String, default: "" },
  image: { type: String, default: "Akya.jpg" },
});

module.exports = mongoose.model("About", AboutSchema);
