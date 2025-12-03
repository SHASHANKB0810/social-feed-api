📌 Social Activity Feed API

A complete social media activity feed system with full role-based permissions (User, Admin, Owner).
Built using Node.js, Express, and MongoDB as part of a backend assignment.

🌟 Features
🔹 Core Features

✅ User Authentication – JWT login/registration with bcrypt password hashing

✅ Post Management – Create, view, like, and delete posts

✅ Follow System – Follow/unfollow other users

✅ Blocking System – Block users (content hidden automatically)

✅ Activity Feed – Real-time feed from followed users

✅ Role-Based Permissions – User, Admin, and Owner access levels

✅ Soft Deletes – Data preserved instead of permanently removed

🔹 Role Permissions Summary
Role	Permissions
User	Create posts, like posts, follow users, block users
Admin	Delete any post/like, view all users, view statistics
Owner	All admin privileges + promote/demote admins + delete users
🛠 Tech Stack

Backend Framework: Node.js + Express.js

Database: MongoDB Atlas / Local MongoDB

Auth: JWT with Bcrypt

Security: Helmet, CORS, environment variables

Logging: Morgan middleware

🚀 Quick Start
🔧 Prerequisites

Node.js v14+

MongoDB Atlas or local MongoDB

Postman / Thunder Client / curl

📥 Installation
1. Clone the Repository
git clone <repository-url>
cd social-feed-api

2. Install Dependencies
npm install

3. Configure Environment Variables

Create your .env file:

cp .env.example .env

4. Edit .env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social_feed

# Local MongoDB (optional)
# MONGODB_URI=mongodb://localhost:27017/social_feed

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
PORT=3000
NODE_ENV=development

▶️ Start the Server
Development mode (auto-restart via nodemon)
npm run dev

Production mode
npm start

🩺 Verify Server is Running
curl http://localhost:3000/health
