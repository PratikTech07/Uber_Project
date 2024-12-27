# User API Documentation

## Register User
Register a new user in the system.

### Endpoint
```
POST /user/register
```

### Request Body
```json
{
  "fullname": {
    "firstname": "string",  // Required, min 3 characters
    "lastname": "string"    // Optional, min 3 characters
  },
  "email": "string",       // Required, valid email format
  "password": "string"     // Required, min 5 characters
}
```

### Response

#### Success Response (201 Created)
```json
{
  "token": "JWT_TOKEN_STRING",
  "user": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "_id": "string"
  }
}
```

#### Error Responses

##### Bad Request (400)
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

##### Internal Server Error (500)
```json
{
  "error": "Internal Server Error"
}
```

### Validation Rules
- First name: Minimum 3 characters
- Email: Must be valid email format
- Password: Minimum 5 characters

### Notes
- The password is automatically hashed before storage
- A JWT token is generated and returned upon successful registration
- The response includes both the authentication token and the user details

## Login User
Authenticate a user and retrieve a JWT token.

### Endpoint
```
POST /user/login
```

### Request Body
```json
{
  "email": "string",       // Required, valid email format
  "password": "string"     // Required, min 5 characters
}
```

### Response

#### Success Response (200 OK)
```json
{
  "token": "JWT_TOKEN_STRING",
  "user": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "_id": "string"
  }
}
```

#### Error Responses

##### Unauthorized (401)
```json
{
  "error": "Invalid credentials"
}
```

##### Internal Server Error (500)
```json
{
  "error": "Internal Server Error"
}
```

## Logout User
Logout the currently authenticated user and invalidate their token.

### Endpoint
```
POST /user/logout
```

### Response

#### Success Response (200 OK)
```json
{
  "message": "Successfully logged out"
}
```

#### Error Responses

##### Unauthorized (401)
```json
{
  "error": "Invalid token"
}
```

##### Internal Server Error (500)
```json
{
  "error": "Internal Server Error"
}
```

## User Profile Endpoint

### GET /users/profile

Get the profile information of the currently authenticated user.

#### Authentication
- Requires Bearer token in Authorization header or token in cookies
- Format: `Bearer <token>`

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
    "success": true,
    "user": {
        "_id": "string",
        "email": "string", 
    }
}
```

**Error (401 Unauthorized)**
```json
{
    "message": "Unauthorized"
}
```

## Captain API Documentation

### Register Captain
Register a new captain in the system.

#### Endpoint
```
POST /captain/register
```

#### Request Body
```json
{
  "fullname": {
    "firstname": "string",  // Required, min 3 characters
    "lastname": "string"    // Required, min 3 characters
  },
  "email": "string",       // Required, valid email format
  "password": "string",    // Required, min 5 characters
  "vehicle": {
    "color": "string",     // Required, min 3 characters
    "plate": "string",     // Required, min 3 characters
    "capacity": "number",  // Required, min 1
    "vehicleType": "string" // Required, enum: ['car', 'motorcycle', 'auto']
  }
}
```

#### Response

##### Success Response (201 Created)
```json
{
  "token": "JWT_TOKEN_STRING",
  "captain": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "type": "string"
    },
    "_id": "string"
  }
}
```

##### Error Responses

###### Bad Request (400)
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

###### Conflict (400)
```json
{
  "message": "Captain already exist"
}
```

#### Validation Rules
- First name: Minimum 3 characters
- Last name: Minimum 3 characters
- Email: Must be valid email format
- Password: Minimum 5 characters
- Vehicle color: Minimum 3 characters
- Vehicle plate: Minimum 3 characters
- Vehicle capacity: Must be greater than 0
- Vehicle type: Must be one of: car, motorcycle, auto

## Captain Endpoints

### Login Captain
Authenticate a captain and receive an access token.

**Endpoint:** `POST /api/captain/login`

**Request Body:**
```json
{
    "email": "captain@example.com",
    "password": "password123"
}
```

**Response (200 OK):**
```json
{
    "token": "jwt_token_here",
    "captain": {
        "_id": "captain_id",
        "firstname": "John",
        "lastname": "Doe",
        "email": "captain@example.com",
        "vehicle": {
            "color": "black",
            "plate": "ABC123",
            "capacity": 4,
            "vehicleType": "car"
        }
    }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid email or password format
- `401 Unauthorized`: Invalid credentials

### Get Captain Profile
Retrieve the authenticated captain's profile information.

**Endpoint:** `GET /api/captain/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
    "captain": {
        "_id": "captain_id",
        "firstname": "John",
        "lastname": "Doe",
        "email": "captain@example.com",
        "vehicle": {
            "color": "black",
            "plate": "ABC123",
            "capacity": 4,
            "vehicleType": "car"
        }
    }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
