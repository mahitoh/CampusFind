# CampusFind Backend API

This is the backend API for the CampusFind application, a lost and found platform designed for campus environments.

## Features

- User authentication (register, login, profile management)
- Lost and found item management
- Search and filtering capabilities
- Real-time notifications with Socket.io
- Claiming system for lost/found items
- Statistics and analytics

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time features
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud instance)

### MongoDB Setup

#### Option 1: Local MongoDB Installation (Recommended for Development)

1. **Download & Install MongoDB Community Server:**

   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select Windows as your OS
   - Download the MSI installer
   - Run the installer and follow the installation wizard
   - Choose "Complete" installation
   - Select "Install MongoDB as a Service" with automatic startup

2. **Create Data Directory:**

   - Create a directory for MongoDB data:
     ```
     mkdir -p D:\data\db
     ```
   - Or use the default location that the installer creates

3. **Verify MongoDB is Running:**
   - Open Command Prompt and run:
     ```
     mongosh
     ```
   - If MongoDB is running, you'll see the MongoDB shell

#### Option 2: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account:**

   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster (the free tier is sufficient for development)

2. **Configure Network Access:**

   - Go to Network Access in the security section
   - Add your IP address or allow access from anywhere (for development only)

3. **Create Database User:**

   - Go to Database Access in the security section
   - Add a new database user with read/write privileges

4. **Get Connection String:**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update the `MONGO_URI` in your `.env` file:
     ```
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusfind?retryWrites=true&w=majority
     ```

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables by creating a `.env` file:
   ```
   NODE_ENV=development
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/campusfind
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

### Running the Server

Development mode with auto-reload:

```
npm run dev
```

Production mode:

```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Items

- `GET /api/items` - Get all items (with filtering)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Claims

- `POST /api/claims` - Create a new claim
- `GET /api/claims/my-claims` - Get user's claims
- `GET /api/claims/received-claims` - Get claims for user's items
- `GET /api/claims/item/:itemId` - Get claims for a specific item
- `PUT /api/claims/:id` - Update claim status
- `PUT /api/claims/:id/complete` - Complete a claim
- `DELETE /api/claims/:id` - Delete a claim

### Notifications

- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/:id` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification

### Search

- `GET /api/search` - Search for items

### Statistics

- `GET /api/stats` - Get system statistics

## Socket.IO Events

### Client -> Server

- `authenticate` - Authenticate user with socket
- `check-item-match` - Check for matching items

### Server -> Client

- `possible-matches` - Send possible item matches
- `item-match-notification` - Notify about potential item match
