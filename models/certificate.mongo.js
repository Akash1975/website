const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    image :{
        type: String,
        required: true
    }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
