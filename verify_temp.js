const fetch = require('node-fetch'); // Ensure node-fetch is available or use native fetch in Node 18+

// If node version is < 18, we might need to install node-fetch, but let's assume standard fetch is available or we use http
// Actually, let's use standard http to be dependency-free in this script
const http = require('http');

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

async function verify() {
    console.log("Starting Verification...");
    const email = `admin_test_${Date.now()}@example.com`;
    const password = 'password123';

    // 1. Register User
    console.log(`\n1. Registering user: ${email}`);
    const regRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email, password });

    if (regRes.status !== 200) {
        console.error("Registration failed:", regRes.body);
        return;
    }
    const token = regRes.body.token;
    const userId = regRes.body.user.id;
    console.log("Registered. Token received.");
    console.log("User Role:", regRes.body.user.role); // Should be 'user'

    // 2. Try to create product (Should FAIL)
    console.log("\n2. Trying to create product as normal user (Expected: 403)");
    const failProdRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
    }, { name: 'Test Prod', price: 100, image: 'url', category: 'filament' });

    console.log(`Status: ${failProdRes.status}, Msg: ${failProdRes.body.msg}`);

    // 3. Update user to ID (We need to do this via DB directly or secret route. 
    // Since I cannot easily access DB shell from here without a script, 
    // I will use a temporary mongoose script to update the role.)
    console.log("\n3. Manually updating user role to 'admin' via DB script...");

    // We will run a separate process to update the DB
    // For this script, we will just pause and ask the user (me) to run the update, 
    // BUT since I am the agent, I can just write a small script to update it.
}

verify();
