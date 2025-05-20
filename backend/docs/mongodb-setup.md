# MongoDB Setup Guide for CampusFind

This guide provides instructions for setting up MongoDB to work with the CampusFind application.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows Installation

1. **Download & Install MongoDB Community Server:**

   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select Windows as your OS
   - Download the MSI installer
   - Run the installer and follow the installation wizard
   - Choose "Complete" installation
   - Select "Install MongoDB as a Service" with automatic startup

2. **Create Data Directory:**

   - Create a directory for MongoDB data:

   ```bash
   mkdir -p D:\data\db
   ```

   - Or use the default location that the installer creates

3. **Verify MongoDB is Running:**
   - Open Command Prompt and run:
   ```bash
   mongosh
   ```
   - If MongoDB is running, you'll see the MongoDB shell

### macOS Installation

1. **Using Homebrew:**

   ```bash
   # Install Homebrew if not already installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community

   # Start MongoDB service
   brew services start mongodb-community
   ```

2. **Verify Installation:**
   ```bash
   mongosh
   ```

### Linux Installation

1. **For Ubuntu/Debian:**

   ```bash
   # Import MongoDB public key
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

   # Create list file
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

   # Update package database
   sudo apt update

   # Install MongoDB
   sudo apt install -y mongodb-org

   # Start MongoDB service
   sudo systemctl start mongod

   # Enable MongoDB on system startup
   sudo systemctl enable mongod
   ```

2. **Verify Installation:**
   ```bash
   mongosh
   ```

## Option 2: MongoDB Atlas (Cloud Database)

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

## Setting Up CampusFind with MongoDB

1. **Update .env File:**

   - For local MongoDB:

   ```
   MONGO_URI=mongodb://localhost:27017/campusfind
   ```

   - For MongoDB Atlas:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/campusfind?retryWrites=true&w=majority
   ```

2. **Initialize Database:**

   - The application will automatically create the required collections when first started

3. **Troubleshooting Connection Issues:**

   - **Local MongoDB:**

     - Ensure the MongoDB service is running
     - Check if the MongoDB port (27017) is accessible
     - Verify you have proper read/write permissions to the data directory

   - **MongoDB Atlas:**
     - Check your network connection
     - Verify your IP address is whitelisted in Atlas Network Access
     - Confirm your username and password are correct in the connection string
     - Make sure your Atlas cluster is active (not paused)

For more information, refer to the [official MongoDB documentation](https://www.mongodb.com/docs/).
