# Authentication API Reference

This document provides details about the authentication endpoints in CampusFind.

## Base URL

All API endpoints are prefixed with `/api` followed by the specific resource.

```
http://localhost:8000/api
```

## Authentication Endpoints

### Register a New User

Creates a new user account in the system.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth Required:** No

#### Request Body

```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

| Field    | Type   | Description                               | Required |
| -------- | ------ | ----------------------------------------- | -------- |
| username | String | User's unique username (3+ characters)    | Yes      |
| email    | String | User's email address (valid email format) | Yes      |
| password | String | User's password (6+ characters)           | Yes      |

#### Success Response

- **Code:** 201 Created
- **Content:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "612f4e88d7c2c123456789ab",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### Error Responses

- **Username Taken:**

  - **Code:** 400 Bad Request
  - **Content:** `{ "success": false, "error": "Username is already taken" }`

- **Email Exists:**

  - **Code:** 400 Bad Request
  - **Content:** `{ "success": false, "error": "User with this email already exists" }`

- **Validation Error:**
  - **Code:** 400 Bad Request
  - **Content:** `{ "success": false, "error": "[Specific validation error message]" }`

### Login User

Authenticates a user and returns a JWT token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** No

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

| Field    | Type   | Description          | Required |
| -------- | ------ | -------------------- | -------- |
| email    | String | User's email address | Yes      |
| password | String | User's password      | Yes      |

#### Success Response

- **Code:** 200 OK
- **Content:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "612f4e88d7c2c123456789ab",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### Error Responses

- **Invalid Credentials:**

  - **Code:** 401 Unauthorized
  - **Content:** `{ "success": false, "error": "Invalid credentials" }`

- **User Not Found:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "success": false, "error": "Invalid credentials" }`

### Get Current User

Returns information about the authenticated user.

- **URL:** `/auth/me`
- **Method:** `GET`
- **Auth Required:** Yes (Bearer Token)

#### Headers

```
Authorization: Bearer [JWT TOKEN]
```

#### Success Response

- **Code:** 200 OK
- **Content:**

```json
{
  "success": true,
  "data": {
    "id": "612f4e88d7c2c123456789ab",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### Error Responses

- **No Token:**

  - **Code:** 401 Unauthorized
  - **Content:** `{ "success": false, "error": "Not authorized to access this route" }`

- **Invalid Token:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "success": false, "error": "Not authorized to access this route" }`

### Logout User

Invalidates the user's token (client-side only).

- **URL:** `/auth/logout`
- **Method:** `GET`
- **Auth Required:** No

#### Success Response

- **Code:** 200 OK
- **Content:**

```json
{
  "success": true,
  "data": {}
}
```

## Database Schema

### User Model

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Prevents password from being returned in queries
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

## Security Implementations

1. **Password Hashing:** All passwords are hashed using bcrypt before storage
2. **JWT Authentication:** JSON Web Tokens are used for secure authentication
3. **Protected Routes:** Certain endpoints require authentication
4. **Input Validation:** All user input is validated before processing
5. **Error Handling:** Proper error handling without exposing sensitive information
