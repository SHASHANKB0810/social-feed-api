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

