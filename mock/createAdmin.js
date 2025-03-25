
// node ./mock/createAdmin.js

const mongoose = require('mongoose');
const User = require('../models/User');

// environment variables
require('dotenv').config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/');

        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: '123456',
            role: 'admin',
            firstname: 'Admin',
            lastname: 'User',
        });


        await adminUser.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdminUser();