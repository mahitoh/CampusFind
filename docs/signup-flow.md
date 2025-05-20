# User Registration Flow

This document outlines the flow of user registration data from the frontend to the database.

## Frontend to Backend Flow

### 1. User Input (Frontend)

- User enters registration information in the `SignUp.jsx` component
- Form collects: username, email, password, confirmPassword

### 2. Form Submission (Frontend)

- Form validates input (password matching, required fields)
- `handleRegisterSubmit` function is triggered
- Data is passed to AuthContext's `signUp` function

### 3. Auth Context (Frontend)

- `signUp` function in `AuthContextNew.jsx` calls the auth service
- No state is updated in the context during signup (only during login)

### 4. Auth Service (Frontend)

- `authService.js` sends an API request to the backend endpoint
- Uses axios via the configured `apiClient.js`
- `POST` request to `/api/auth/register` with user data
- Handles the response and returns a structured result object

### 5. API Request (Network)

- Request is sent to the backend server
- Data includes: username, email, password
- Headers include Content-Type: application/json

## Backend to Database Flow

### 6. Route Handling (Backend)

- `authRoutes.js` routes the request to the register controller
- `POST /api/auth/register` maps to `register` function

### 7. Auth Controller (Backend)

- `authController.js` validates the input
- Checks if username or email already exists
- Creates a new user using the User model

### 8. User Model (Backend)

- `User.js` defines the schema for user data
- Includes pre-save hook for password hashing
- Mongoose connects the model to MongoDB collection

### 9. Database Storage (MongoDB)

- User document is created in the `users` collection
- Password is securely hashed
- MongoDB assigns a unique `_id` to the document

### 10. Response Flow (Backend to Frontend)

- Backend sends back success response with user data
- Frontend handles the response and redirects to login
- User can now log in with their newly created account

## Data Security Measures

1. **Password Security**:

   - Passwords are never stored in plain text
   - Bcrypt is used for one-way hashing
   - Password hash is not included in responses

2. **User Input Validation**:

   - Frontend validation ensures basic field requirements
   - Backend validation provides stronger security checks
   - MongoDB schema validation enforces data types

3. **Error Handling**:
   - Detailed error messages provided for debugging
   - User-friendly error messages displayed to users
   - Failed registrations do not create partial records

## Testing the Flow

To verify the registration flow is working:

1. Run the MongoDB connection check:

   ```
   cd backend && node scripts/check-db-connection.js
   ```

2. Run the registration test:

   ```
   cd backend && node scripts/test-user-registration.js
   ```

3. Manual testing through the UI:
   - Navigate to the signup page
   - Complete the registration form
   - Verify successful registration and ability to login
