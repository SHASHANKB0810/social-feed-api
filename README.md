# Social Activity Feed API

A complete social media activity feed system with proper role-based permissions (User, Admin, Owner). Built as a backend assignment with Node.js, Express, and MongoDB.

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

## 📁 Project Structure

social-feed-api/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   │
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Post.js              # Post schema
│   │   ├── Like.js              # Like schema
│   │   ├── Follow.js            # Follow schema
│   │   ├── Block.js             # Block schema
│   │   └── Activity.js          # Activity feed schema
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── permissions.js       # Role-based access control
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── postController.js    # Post CRUD operations
│   │   ├── feedController.js    # Personalized feed logic
│   │   └── adminController.js   # Admin-specific routes/actions
│   │
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── users.js             # User routes
│   │   ├── posts.js             # Post routes
│   │   ├── feed.js              # Feed routes
│   │   └── admin.js             # Admin routes
│   │
│   └── app.js                   # Express application config
│
├── .env                         # Environment variables
├── .env.example                 # Example environment file
├── package.json                 # Dependencies & scripts
├── server.js                    # Server entry point
└── README.md                    # Project documentation

