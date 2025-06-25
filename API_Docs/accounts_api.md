# Accounts API Documentation

## Overview

The Accounts API handles user authentication, registration, profile management, and account-related operations for the MyStore platform.

## Base URL
`/api/accounts/`

## Authentication

Most endpoints require JWT authentication except for registration and login.

## Endpoints

### Authentication

#### Login
```http
POST /api/accounts/login/
```

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "user@example.com",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_staff": false,
      "is_superuser": false
    }
  },
  "message": "Login successful"
}
```

#### Register
```http
POST /api/accounts/register/
```

**Request Body:**
```json
{
  "username": "newuser@example.com",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "password_confirm": "securepassword123",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+27123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "username": "newuser@example.com",
      "email": "newuser@example.com",
      "first_name": "Jane",
      "last_name": "Smith"
    },
    "message": "Registration successful. Please check your email for verification."
  }
}
```

#### Refresh Token
```http
POST /api/accounts/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Logout
```http
POST /api/accounts/logout/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

### User Profile

#### Get Current User Profile
```http
GET /api/accounts/profile/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+27123456789",
    "date_joined": "2024-01-15T10:30:00Z",
    "last_login": "2025-01-20T14:22:00Z",
    "profile": {
      "bio": "Software developer from Cape Town",
      "avatar": "https://example.com/media/avatars/user1.jpg",
      "date_of_birth": "1990-05-15",
      "gender": "M",
      "location": "Cape Town, South Africa"
    }
  }
}
```

#### Update Profile
```http
PUT /api/accounts/profile/
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+27123456789",
  "profile": {
    "bio": "Updated bio",
    "date_of_birth": "1990-05-15",
    "gender": "M",
    "location": "Johannesburg, South Africa"
  }
}
```

#### Upload Avatar
```http
POST /api/accounts/profile/avatar/
```

**Request Body (multipart/form-data):**
```
avatar: <image_file>
```

### Address Management

#### List Addresses
```http
GET /api/accounts/addresses/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "shipping",
      "first_name": "John",
      "last_name": "Doe",
      "company": "",
      "address_line_1": "123 Main Street",
      "address_line_2": "Apt 4B",
      "city": "Cape Town",
      "province": "Western Cape",
      "postal_code": "8001",
      "country": "ZA",
      "phone": "+27123456789",
      "is_default": true
    }
  ]
}
```

#### Create Address
```http
POST /api/accounts/addresses/
```

**Request Body:**
```json
{
  "type": "billing",
  "first_name": "John",
  "last_name": "Doe",
  "address_line_1": "456 Oak Avenue",
  "city": "Johannesburg",
  "province": "Gauteng",
  "postal_code": "2000",
  "country": "ZA",
  "phone": "+27123456789",
  "is_default": false
}
```

#### Update Address
```http
PUT /api/accounts/addresses/{id}/
```

#### Delete Address
```http
DELETE /api/accounts/addresses/{id}/
```

### Password Management

#### Change Password
```http
POST /api/accounts/change-password/
```

**Request Body:**
```json
{
  "old_password": "currentpassword",
  "new_password": "newpassword123",
  "new_password_confirm": "newpassword123"
}
```

#### Reset Password Request
```http
POST /api/accounts/password-reset/
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### Reset Password Confirm
```http
POST /api/accounts/password-reset/confirm/
```

**Request Body:**
```json
{
  "token": "password-reset-token",
  "new_password": "newpassword123",
  "new_password_confirm": "newpassword123"
}
```

### Email Verification

#### Resend Verification Email
```http
POST /api/accounts/verify-email/resend/
```

#### Verify Email
```http
POST /api/accounts/verify-email/confirm/
```

**Request Body:**
```json
{
  "token": "email-verification-token"
}
```

### Account Settings

#### Get Email Preferences
```http
GET /api/accounts/email-preferences/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_confirmation": true,
    "order_status_update": true,
    "password_reset": true,
    "inventory_alerts": false,
    "marketing": false,
    "receive_digest": true
  }
}
```

#### Update Email Preferences
```http
PUT /api/accounts/email-preferences/
```

**Request Body:**
```json
{
  "marketing": true,
  "inventory_alerts": true
}
```

#### Deactivate Account
```http
POST /api/accounts/deactivate/
```

**Request Body:**
```json
{
  "password": "currentpassword",
  "reason": "No longer needed"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Username/password incorrect |
| `EMAIL_NOT_VERIFIED` | Email address not verified |
| `ACCOUNT_DISABLED` | User account is disabled |
| `TOKEN_EXPIRED` | JWT token has expired |
| `WEAK_PASSWORD` | Password doesn't meet requirements |
| `EMAIL_ALREADY_EXISTS` | Email address already registered |
| `INVALID_TOKEN` | Invalid verification/reset token |

## Rate Limits

- **Login attempts**: 5 per minute per IP
- **Registration**: 3 per hour per IP
- **Password reset**: 3 per hour per email
- **Profile updates**: 10 per minute per user

## Examples

### Complete Registration Flow
```bash
# 1. Register
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser@example.com",
    "email": "newuser@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "Jane",
    "last_name": "Smith"
  }'

# 2. Verify email (check email for token)
curl -X POST http://localhost:8000/api/accounts/verify-email/confirm/ \
  -H "Content-Type: application/json" \
  -d '{"token": "verification-token-from-email"}'

# 3. Login
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser@example.com",
    "password": "securepassword123"
  }'
```
