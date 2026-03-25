# Authentication Design


### **Overview:**
#### This project implements a moden authentication system using:
- JSON Web Token(JWT)
- Refresh Tokens
- Redis for session management and security

### **Token Strategy:**

**Access token** only lived for 15 minutes used for accessing protected routes. and will be stored in client side.

**Refresh token** lasts longer, for 7 days and will be stored in redis used to generate new access token.

### **Authentication Flow:**

**Register**

```javascript
POST /auth/register
```
 - Verify input
 - Hash Password using bcrypt
 - Store user in DB

**Login**
```javascript
POST /auth/login
```

 - Verify credentials
 - Generate acceess and refresh tokens
 - Store refresh token in redis

**Access Protected Routes**

 - Requires authorization header in each req
 - JWT is verified server-side

**Refresh token**

 - Validates refresh token
 - Issues new access token

**Logout**
 - Deletes refresh token from Redis

**Security Considerations**
 - Passwords are hashed using bcrypt
 - Rate Limiting is applied on auth routes
 - Tokens have expiration times
 - Refresh tokens are stored securely in redis

 
### **Alternatinve Approaches:**
**Session-Based Authentication**
 - Server stores session
 - Not scalable in distributed systems

**JWT without Refresh Token**
 - Simpler
 - Less secure 

**OAuth 2.0**
 - Used for third-party login(Google, Github)
 - Not require for internal auth 
