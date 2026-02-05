const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        name: String,
        price: Number,
        quantity: Number,
        color: String,
        image: String
    }],
    totalAmount: Number,
    shippingDetails: {
        mobile: String,
        email: String,
        address: String,
        pincode: String
    },
    status: {
        type: String,
        default: 'Pending' // Pending, Paid, Shipped, Delivered
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
