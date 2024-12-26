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
