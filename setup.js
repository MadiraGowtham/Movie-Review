#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎬 Movie Review Platform Setup');
console.log('==============================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
  console.error('❌ Node.js version 14 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create .env file for backend if it doesn't exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  const envContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://madiragowtham19:M8qRs6R1ayBKA7bE@cluster0.sievzrz.mongodb.net/movie-review-platform
JWT_SECRET=4ec8a951a7ee92b3dd304bf7fb2f24bdb08c636a32ab42e03b62c9ab43fba228
`;
  
  fs.writeFileSync(backendEnvPath, envContent);
  console.log('✅ Created backend/.env file');
} else {
  console.log('✅ Backend .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing backend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
  
  console.log('Installing frontend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Seed the database
console.log('\n🌱 Seeding database...');
try {
  execSync('npm run seed', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  console.log('You can run "npm run seed" in the backend directory later');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\nTo start the application:');
console.log('1. Run "npm run dev" to start both frontend and backend');
console.log('2. Or run "npm run server" and "npm run client" separately');
console.log('\nThe application will be available at:');
console.log('- Frontend: http://localhost:3000');
console.log('- Backend: http://localhost:5000');
console.log('\nSample accounts created:');
console.log('- Admin: admin@moviereview.com / admin123');
console.log('- User: movielover@example.com / password123');
console.log('- User: critic@example.com / password123');
console.log('- User: student@example.com / password123');
