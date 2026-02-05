const mongoose = require('mongoose');
const Product = require('./models/Product');
const Material = require('./models/Material');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://localhost:27017/3d-power', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to DB");

        // Clear existing data (optional, maybe safe to check if empty first)
        // await Product.deleteMany({});
        // await Material.deleteMany({});

        const filaments = [
            { name: 'PLA Standard', price: 999, category: 'filament', colors: ['#FF0000', '#0000FF', '#00FF00', '#000000', '#FFFFFF'], image: 'https://placehold.co/400x400/1a1a2e/00f3ff?text=PLA+Standard', description: 'Standard PLA for everyday printing.' },
            { name: 'PETG Strong', price: 1199, category: 'filament', colors: ['#FFA500', '#000000', '#FFFFFF', '#808080'], image: 'https://placehold.co/400x400/1a1a2e/bc13fe?text=PETG+Strong', description: 'Strong and heat resistant PETG.' },
            { name: 'TPU Flexible', price: 1499, category: 'filament', colors: ['#FFFF00', '#000000', 'transparent'], image: 'https://placehold.co/400x400/1a1a2e/00f3ff?text=TPU+Flexible', description: 'Flexible TPU for rubber-like parts.' },
            { name: 'ABS Durable', price: 1099, category: 'filament', colors: ['#000000', '#FFFFFF', '#FF0000'], image: 'https://placehold.co/400x400/1a1a2e/bc13fe?text=ABS+Durable', description: 'Durable ABS for mechanical parts.' },
            { name: 'PLA+ Enhanced', price: 1299, category: 'filament', colors: ['#800080', '#FFC0CB', '#000000'], image: 'https://placehold.co/400x400/1a1a2e/00f3ff?text=PLA++Enhanced', description: 'Enhanced PLA with better strength.' },
            { name: 'PLA Pro', price: 1599, category: 'filament', colors: ['#C0C0C0', '#FFD700', '#CD7F32'], image: 'https://placehold.co/400x400/1a1a2e/bc13fe?text=PLA+Pro', description: 'Professional grade PLA.' },
        ];

        const printedProducts = [
            { name: 'Custom Keychain', price: 199, category: 'printed', image: 'https://placehold.co/400x400/1a1a2e/00f3ff?text=Keychain', description: 'Customized keychain.' },
            { name: 'Geometric Heart', price: 299, category: 'printed', image: 'https://placehold.co/400x400/1a1a2e/bc13fe?text=Heart', description: 'Geometric heart decoration.' },
            { name: 'Phone Stand', price: 399, category: 'printed', image: 'https://placehold.co/400x400/1a1a2e/00f3ff?text=Phone+Stand', description: 'Sturdy phone stand.' },
            { name: 'Lithophane Photo', price: 599, category: 'printed', image: 'https://placehold.co/400x400/1a1a2e/bc13fe?text=Lithophane', description: 'Personalized lithophane photo.' },
            { name: 'Articulated Dragon', price: 899, category: 'printed', image: 'https://placehold.co/400x400/1a1a2e/00f3ff?text=Dragon', description: 'Fun articulated dragon toy.' },
            { name: 'Modern Vase', price: 699, category: 'printed', image: 'https://placehold.co/400x400/1a1a2e/bc13fe?text=Vase', description: 'Stylish modern vase.' },
        ];

        const materials = [
            {
                name: "PLA (Polylactic Acid)",
                price: "₹8/gram",
                emoji: "🌽",
                description: "Biodegradable, easy to print, good for display models and prototypes. available in many colors.",
                bestFor: "Prototypes, Decor, Toys, Non-functional parts"
            },
            {
                name: "PETG (Polyethylene Terephthalate Glycol)",
                price: "₹12/gram",
                emoji: "🥤",
                description: "Stronger than PLA, heat resistant, slightly flexible. Great for functional parts.",
                bestFor: "Mechanical parts, Outdoor use, Containers"
            },
            {
                name: "TPU (Thermoplastic Polyurethane)",
                price: "₹15/gram",
                emoji: "👟",
                description: "Flexible, rubber-like material. Resistant to abrasion and impact.",
                bestFor: "Phone cases, Gaskets, Flexible hinges"
            },
            {
                name: "ABS (Acrylonitrile Butadiene Styrene)",
                price: "₹12/gram",
                emoji: "🧱",
                description: "Very strong, durable, heat resistant. Requires finishing/acetone smoothing.",
                bestFor: "Automotive parts, Helmets, Heavy duty functional parts"
            }
        ];

        // Check counts
        const pCount = await Product.countDocuments();
        const mCount = await Material.countDocuments();

        if (pCount === 0) {
            await Product.insertMany([...filaments, ...printedProducts]);
            console.log("Seeded Products");
        } else {
            console.log("Products already exist, skipping seed.");
        }

        if (mCount === 0) {
            await Material.insertMany(materials);
            console.log("Seeded Materials");
        } else {
            console.log("Materials already exist, skipping seed.");
        }

        console.log("Done");
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
