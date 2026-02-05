const mongoose = require('mongoose');
const User = require('./models/User');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

// HTTP Request Helper
function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function run() {
    console.log("Connecting to DB...");
    await mongoose.connect('mongodb://localhost:27017/3d-power', { useNewUrlParser: true, useUnifiedTopology: true });

    const email = `test_admin_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Creating Admin User: ${email}`);
    // Create directly in DB to bypass register route (which sets role='user')
    // Alternatively, register then update. Let's register to get the token easily.

    // 1. Register
    const regRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email, password });

    if (regRes.status !== 200) {
        console.error("Registration failed", regRes.body);
        process.exit(1);
    }

    const token = regRes.body.token;
    console.log("Registered. Token received.");

    // 2. Promote to Admin
    console.log("Promoting to Admin via Mongoose...");
    await User.updateOne({ email }, { $set: { role: 'admin' } });

    // 3. Test Admin Route (Create Product)
    console.log("Attempting to create product as Admin...");
    const prodRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
    }, {
        name: 'Verified Filament',
        price: 999,
        image: 'http://test.com/img.jpg',
        category: 'filament',
        colors: ['#000'],
        description: 'Verified via script'
    });

    if (prodRes.status === 200) {
        console.log("SUCCESS: Product created successfully!");
        console.log("Product ID:", prodRes.body._id);

        // Cleanup
        await request({
            hostname: 'localhost', port: 5000, path: `/api/products/${prodRes.body._id}`, method: 'DELETE',
            headers: { 'x-auth-token': token }
        });
        console.log("Cleaned up test product.");
    } else {
        console.error("FAILURE: Could not create product.", prodRes.status, prodRes.body);
    }

    // Cleanup User
    await User.deleteOne({ email });
    console.log("Cleaned up test user.");

    mongoose.disconnect();
}

run();
