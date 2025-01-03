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

# Maps API Documentation

## Get Coordinates
Retrieve the coordinates (latitude and longitude) for a given address.

### Endpoint
```
GET /maps/get-coordinates
```

### Query Parameters
- `address` (string): The address to get coordinates for. Required.

### Response

#### Success Response (200 OK)
```json
{
  "lat": "number",
  "lon": "number"
}
```

#### Error Responses

##### Bad Request (400)
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "address",
      "location": "query"
    }
  ]
}
```

##### Internal Server Error (500)
```json
{
  "error": "Error getting coordinates: <error_message>"
}
```

## Get Distance and Time
Retrieve the distance and estimated travel time between two locations.

### Endpoint
```
GET /maps/get-distance-time
```

### Query Parameters
- `origin` (string): The starting location. Required.
- `destination` (string): The destination location. Required.

### Response

#### Success Response (200 OK)
```json
{
  "distance": {
    "text": "string",
    "value": "number"
  },
  "duration": {
    "text": "string",
    "value": "number"
  }
}
```

#### Error Responses

##### Bad Request (400)
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "origin",
      "location": "query"
    },
    {
      "msg": "Invalid value",
      "param": "destination",
      "location": "query"
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

## Get Suggestions
Retrieve address suggestions based on a partial input.

### Endpoint
```
GET /maps/get-suggestions
```

### Query Parameters
- `input` (string): The partial address input to get suggestions for. Required.

### Response

#### Success Response (200 OK)
```json
[
  {
    "description": "string",
    "place_id": "string"
  }
]
```

#### Error Responses

##### Bad Request (400)
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "input",
      "location": "query"
    }
  ]
}
```

##### Internal Server Error (500)
```json
{
  "error": "Error getting suggestions: <error_message>"
}
```

### Example
#### Request
```
GET /maps/get-suggestions?input=1600+Amphitheatre
```

#### Success Response
```json
[
  {
    "description": "1600 Amphitheatre Parkway, Mountain View, CA, USA",
    "place_id": "ChIJ2eUgeAK6j4ARbn5u_wAGqWA"
  },
  {
    "description": "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
    "place_id": "ChIJ2eUgeAK6j4ARbn5u_wAGqWA"
  }
]
```

# API Documentation

## Rides

### Create Ride

**Endpoint:** `POST /rides/create`

**Description:** Creates a new ride with the provided details.

**Request Body:**
- `pickup` (string, required): The pickup address.
- `destination` (string, required): The destination address.
- `vehicleType` (string, required): The type of vehicle (`auto`, `motorcycle`, `car`).

**Headers:**
- `Authorization` (string, required): Bearer token for user authentication.

**Response:**
- `201 Created`: Returns the created ride object.
- `400 Bad Request`: If validation fails.
- `500 Internal Server Error`: If there is a server error.

**Example Request:**
```bash
curl -X POST http://localhost:3000/rides/create \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
    "pickup": "123 Main St",
    "destination": "456 Elm St",
    "vehicleType": "car"
}'
```

**Example Response:**
```json
{
    "_id": "60c72b2f9b1e8b001c8e4b8e",
    "user": "60c72b2f9b1e8b001c8e4b8d",
    "pickup": "123 Main St",
    "destination": "456 Elm St",
    "fare": 100,
    "otp": "123456",
    "vehicleType": "car",
    "status": "pending",
    "createdAt": "2023-10-01T12:00:00.000Z",
    "updatedAt": "2023-10-01T12:00:00.000Z"
}
```
