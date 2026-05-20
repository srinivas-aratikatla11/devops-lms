const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

const ADMIN = {
  name:     'Admin',
  email:    'admin@devopsacademy.com',
  password: 'admin123',
  role:     'admin',
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log('⚠️  Admin already exists. Skipping.');
      process.exit(0);
    }

    await User.create(ADMIN);
    console.log('🎉 Admin created!');
    console.log('Email    :', ADMIN.email);
    console.log('Password :', ADMIN.password);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

seed();
