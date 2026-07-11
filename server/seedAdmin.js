require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }

    if (adminPassword.length < 6) {
      console.error('ADMIN_PASSWORD must be at least 6 characters.');
      process.exit(1);
    }

    const adminExists = await User.findOne({ email: adminEmail }).select('+password');

    if (adminExists) {
      adminExists.password = adminPassword;
      adminExists.role = 'admin';
      adminExists.name = adminExists.name || 'Admin';

      await adminExists.save();

      console.log('Admin already existed. Password and role updated.');
    } else {
      const admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });

      await admin.save();

      console.log('Admin created successfully.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();