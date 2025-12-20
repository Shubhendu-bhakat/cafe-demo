# Coffee Shop Booking API Documentation

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the server folder with the following:

```
DATABASE_URL=postgresql://username:password@localhost:5432/coffee_shop_db
PORT=8080
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Prisma & Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate
```

### 4. Start Server
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

---

## API Endpoints

### Authentication Routes

#### Signup
- **POST** `/api/auth/signup`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "User created successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210"
  }
}
```

#### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** (Same as signup)

---

### Booking Routes (All Protected - Require JWT Token)

#### Create Booking
- **POST** `/api/bookings/book`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
```json
{
  "date": "2025-12-25",
  "time": "18:30",
  "numberOfPeople": 4,
  "specialRequest": "Window seat preferred"
}
```
- **Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "userId": 1,
    "date": "2025-12-25",
    "time": "18:30",
    "numberOfPeople": 4,
    "specialRequest": "Window seat preferred",
    "status": "pending",
    "createdAt": "2025-12-20T10:00:00.000Z",
    "updatedAt": "2025-12-20T10:00:00.000Z"
  }
}
```

#### Get User's Bookings
- **GET** `/api/bookings/my-bookings`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
```json
{
  "bookings": [
    {
      "id": 1,
      "userId": 1,
      "date": "2025-12-25",
      "time": "18:30",
      "numberOfPeople": 4,
      "specialRequest": null,
      "status": "pending",
      "createdAt": "2025-12-20T10:00:00.000Z",
      "updatedAt": "2025-12-20T10:00:00.000Z"
    }
  ]
}
```

#### Get Booking by ID
- **GET** `/api/bookings/booking/:id`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`

#### Update Booking
- **PUT** `/api/bookings/booking/:id`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:** (Send only fields to update)
```json
{
  "date": "2025-12-26",
  "time": "19:00",
  "numberOfPeople": 5
}
```

#### Cancel Booking
- **DELETE** `/api/bookings/booking/:id`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`

---

## Frontend Integration Example

### Using Fetch API

```javascript
// Signup
async function signup(name, email, mobile, password) {
  const response = await fetch('http://localhost:8080/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, mobile, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}

// Login
async function login(email, password) {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}

// Book Appointment
async function bookAppointment(date, time, numberOfPeople, specialRequest) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/api/bookings/book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ date, time, numberOfPeople, specialRequest })
  });
  return await response.json();
}

// Get User's Bookings
async function getMyBookings() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/api/bookings/my-bookings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}
```

---

## Database Schema

### User Table
```
id: Int (PK)
name: String
email: String (Unique)
mobile: String
password: String (Hashed with bcrypt)
createdAt: DateTime
updatedAt: DateTime
```

### Booking Table
```
id: Int (PK)
userId: Int (FK)
date: String (YYYY-MM-DD)
time: String (HH:MM)
numberOfPeople: Int
specialRequest: String (Optional)
status: String (pending, confirmed, cancelled)
createdAt: DateTime
updatedAt: DateTime
```

---

## Error Handling

All errors return a JSON response with an error message:

```json
{
  "error": "Error description"
}
```

Common error codes:
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (not authorized for this resource)
- **404**: Not Found
- **500**: Server Error

---

## Security Features

✅ JWT Token Authentication
✅ Password Hashing with bcrypt
✅ Input Validation with Zod
✅ CORS Enabled
✅ Protected Routes (Authorization checks)
✅ User Ownership Verification for Bookings
