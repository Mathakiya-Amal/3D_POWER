const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String, // URL
        required: true
    },
    category: {
        type: String,
        enum: ['filament', 'printed'],
        required: true
    },
    colors: [String], // Array of hex codes or names, mostly for filaments
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
