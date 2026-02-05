const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://localhost:27017/3d-power', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to DB");
        const email = 'kingsman8047@gmail.com';
        const password = 'password123'; // Default password

        let user = await User.findOne({ email });

        if (user) {
            console.log("User exists. Updating role to admin...");
            user.role = 'admin';
            await user.save();
            console.log("User updated successfully.");
        } else {
            console.log("User does not exist. Creating new Admin user...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                email,
                password: hashedPassword,
                role: 'admin'
            });
            await user.save();
            console.log(`User created successfully.\nEmail: ${email}\nPassword: ${password}`);
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
