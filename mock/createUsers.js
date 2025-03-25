// node ./mock/createUsers.js

const mongoose = require('mongoose');
const User = require('../models/User');

// environment variables
require('dotenv').config();

const createUsers = async (users) => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/');

        for (const userData of users) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`User with email ${userData.email} already exists`);
                continue;
            }

            const newUser = new User(userData);
            await newUser.save();
            console.log(`User ${userData.email} created successfully`);
        }
    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
        mongoose.connection.close();
    }
};

const users = [
    {
        username: 'employee_user',
        email: 'employee@example.com',
        password: 'employee123',
        role: 'employee',
        firstname: 'Employee',
        lastname: 'User',
    },
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'reader',
        firstname: 'John',
        lastname: 'Doe',
    },
];

createUsers(users);