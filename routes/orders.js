const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Create Order
router.post('/', auth, async (req, res) => {
    try {
        const { products, totalAmount, shippingDetails } = req.body;

        const newOrder = new Order({
            user: req.user.id,
            products,
            totalAmount,
            shippingDetails,
            status: 'Pending'
        });

        const order = await newOrder.save();
        res.json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User Orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
