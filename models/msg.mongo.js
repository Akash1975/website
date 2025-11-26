const mongoose = require("mongoose");

// Schema
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },

  message: {
    type: String,
    required: true,
    trim: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

// Model
const Message = mongoose.model("Message", messageSchema);

// Function to save message
async function saveMessage(data) {
  const newMessage = new Message({
    name: data.name,
    email: data.email,
    message: data.message
  });

  return await newMessage.save();
}

module.exports = { Message, saveMessage };
