# Social Activity Feed API

A complete social media activity feed system with proper role-based permissions (User, Admin, Owner). Built as a backend assignment with Node.js, Express, and MongoDB.

Deployment link : https://social-feed-api-vg44.onrender.com

## 🌟 Features

### Core Features
- ✅ **User Authentication** - JWT-based registration/login with password hashing
- ✅ **Post Management** - Create, view, like, and delete posts
- ✅ **Follow System** - Follow/unfollow other users
- ✅ **Blocking System** - Block users to hide their content
- ✅ **Activity Feed** - Real-time feed showing all network activities
- ✅ **Role-Based Permissions** - Three-tier system (User, Admin, Owner)
- ✅ **Soft Deletes** - Preserve data integrity while allowing content removal

### Permission Management
- **Users** - Can create posts, like posts, follow users, block users
- **Admins** - Can delete any posts/likes, view all users, view statistics
- **Owners** - Can do everything admins can + create/delete admins, delete users

## 🛠 Tech Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB Atlas (Cloud) / MongoDB (Local)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Security**: Helmet, CORS, environment variables
- **Logging**: Morgan HTTP request logger


## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account OR local MongoDB installation
- Postman or curl for API testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-feed-api
Install dependencies

bash
npm install
Configure environment variables

bash
cp .env.example .env
Edit .env file:

env
# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social_feed

# For local MongoDB
# MONGODB_URI=mongodb://localhost:27017/social_feed

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
PORT=3000
NODE_ENV=development
Start the server

bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
Verify server is running

bash
curl http://localhost:3000/health
Should return: {"status":"OK","timestamp":"..."}

📚 API Documentation
Base URL
Local: http://localhost:3000

Production: https://your-deployed-url.com

Authentication
Register User
http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
Login User
http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
Get Profile
http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
Posts
Create Post
http
POST /api/posts
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "This is my first post!"
}
Get All Posts
http
GET /api/posts
Authorization: Bearer <jwt_token>
Like a Post
http
POST /api/posts/:id/like
Authorization: Bearer <jwt_token>
Delete a Post
http
DELETE /api/posts/:id
Authorization: Bearer <jwt_token>
Users
Follow a User
http
POST /api/users/:id/follow
Authorization: Bearer <jwt_token>
Block a User
http
POST /api/users/:id/block
Authorization: Bearer <jwt_token>
Activity Feed
Get Activity Feed
http
GET /api/feed
Authorization: Bearer <jwt_token>


Response Example:

json
[
  {
    "id": "65a1b2c3d4e5f67890123456",
    "type": "post_created",
    "message": "john_doe made a post",
    "user": {
      "_id": "65a1b2c3d4e5f67890123456",
      "username": "john_doe"
    },
    "targetPost": {
      "_id": "65a1b2c3d4e5f67890123457",
      "content": "This is my first post!"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "65a1b2c3d4e5f67890123458",
    "type": "user_followed",
    "message": "jane_doe followed john_doe",
    "user": {
      "_id": "65a1b2c3d4e5f67890123459",
      "username": "jane_doe"
    },
    "targetUser": {
      "_id": "65a1b2c3d4e5f67890123456",
      "username": "john_doe"
    },
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
]
Admin Endpoints
Get All Users (Admin/Owner only)
http
GET /api/admin/users
Authorization: Bearer <admin_token>
Get Statistics (Admin/Owner only)
http
GET /api/admin/stats
Authorization: Bearer <admin_token>
Delete Any Post (Admin/Owner only)
http
DELETE /api/admin/posts/:id
Authorization: Bearer <admin_token>
Delete User (Owner only)
http
DELETE /api/admin/users/:id
Authorization: Bearer <owner_token>
Make User Admin (Owner only)
http
POST /api/admin/users/:id/make-admin
Authorization: Bearer <owner_token>

🧪 Testing the API
Using Postman
Import the provided social-feed-api.postman_collection.json

Set environment variable base_url to http://localhost:3000

Execute requests in sequence:

Start with registration to get JWT token

Use token in Authorization header for subsequent requests

Test all endpoints

Using cURL
bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass123"}'

# Create post (use token from registration)
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Test post"}'

# Get activity feed
curl -X GET http://localhost:3000/api/feed \
  -H "Authorization: Bearer YOUR_TOKEN"
🗄 Database Schema
User Model
javascript
{
  username: String,      // Unique, required
  email: String,         // Unique, required
  password: String,      // Hashed, required
  role: String,          // 'user', 'admin', 'owner'
  isActive: Boolean,     // Soft delete flag
  profile: Object,       // Bio, avatar
  createdAt: Date,
  updatedAt: Date
}
Activity Model
javascript
{
  user: ObjectId,        // Reference to User
  type: String,          // 'post_created', 'post_liked', 'user_followed'
  targetUser: ObjectId,  // Reference to User (for follows/likes)
  targetPost: ObjectId,  // Reference to Post (for posts/likes)
  metadata: Mixed,       // Additional data
  isVisible: Boolean,    // Hidden if blocked
  createdAt: Date
}
🚢 Deployment
Render (Recommended - Free Tier)
Push code to GitHub

Sign up at render.com

Create new Web Service

Connect GitHub repository

Add environment variables

Deploy

Environment Variables for Production
env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=strong_random_secret_key
JWT_EXPIRY=7d
PORT=3000
NODE_ENV=production
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add some AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
SHASHANK R BELLAD

GitHub: @SHASHANKB0810

Email: shashankbellad0810@gmail.com

🙏 Acknowledgments
Inkle for the assignment

MongoDB Atlas for free cloud database

Express.js team for the amazing framework

All open-source contributors
