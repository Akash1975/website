const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Certificate", certificateSchema);
