const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Material = require('../models/Material');

// @route   GET api/materials
// @desc    Get all materials
// @access  Public
router.get('/', async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/materials
// @desc    Add new material
// @access  Private/Admin
router.post('/', [auth, admin], async (req, res) => {
    const { name, price, emoji, description, bestFor } = req.body;

    try {
        const newMaterial = new Material({
            name,
            price,
            emoji,
            description,
            bestFor
        });

        const material = await newMaterial.save();
        res.json(material);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/materials/:id
// @desc    Update material
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
    const { name, price, emoji, description, bestFor } = req.body;

    const materialFields = {};
    if (name) materialFields.name = name;
    if (price) materialFields.price = price;
    if (emoji) materialFields.emoji = emoji;
    if (description) materialFields.description = description;
    if (bestFor) materialFields.bestFor = bestFor;

    try {
        let material = await Material.findById(req.params.id);

        if (!material) return res.status(404).json({ msg: 'Material not found' });

        material = await Material.findByIdAndUpdate(
            req.params.id,
            { $set: materialFields },
            { new: true }
        );

        res.json(material);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/materials/:id
// @desc    Delete material
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        let material = await Material.findById(req.params.id);

        if (!material) return res.status(404).json({ msg: 'Material not found' });

        await Material.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Material removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
