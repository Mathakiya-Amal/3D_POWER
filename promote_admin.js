const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect('mongodb://localhost:27017/3d-power', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to DB");
        const email = process.argv[2];
        if (!email) { console.log("Please provide email"); process.exit(1); }

        const res = await User.updateOne({ email: email }, { $set: { role: 'admin' } });
        console.log("Update Result:", res);
        process.exit();
    })
    .catch(err => console.log(err));
