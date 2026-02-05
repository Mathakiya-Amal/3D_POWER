const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String, // Text field like "₹8/gram"
        required: true
    },
    emoji: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bestFor: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Material', materialSchema);
