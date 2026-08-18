[README.md](https://github.com/user-attachments/files/31183180/README.md)
# CarWale

A full-stack car marketplace web application built with React, Node.js,
Express, and MongoDB. CarWale supports separate buyer and seller
experiences, car discovery and filtering, wishlists, comparisons,
reviews, seller listings, user profiles, and an AI-powered car buying
assistant using Google Gemini.

## Live Demo

**Frontend:** https://car-wale-eta.vercel.app/

**Backend API:** https://car-wale-x3ml.onrender.com/

> The backend is hosted on a free-tier instance, so the first API
> request after inactivity may take a little longer.

------------------------------------------------------------------------

## Features

### Buyer

-   Browse active car listings
-   Search cars by brand, model, and city
-   Filter by:
    -   Brand
    -   Fuel type
    -   Transmission
    -   Minimum price
    -   Maximum price
-   Sort car listings
-   View detailed car information
-   View similar cars
-   Add/remove cars from wishlist
-   Compare multiple cars
-   View seller contact details
-   Submit and view car reviews
-   View car specifications, highlights, FAQs, and ratings
-   Switch between English and Hindi
-   Set location preferences
-   Access an AI-powered car buying assistant

### Seller

-   Seller dashboard
-   View personal car listings
-   Add new car listings
-   Edit existing listings
-   Delete listings
-   View listing statistics
-   Track total views
-   Track wishlist saves
-   View portfolio value and pricing insights

### Authentication & User Management

-   Buyer and seller registration
-   Login with role validation
-   Protected routes
-   User profile
-   Update profile information
-   Persistent user preferences using local storage

### AI Car Assistant

CarWale includes **CarBot AI**, a Google Gemini-powered assistant
designed specifically for car-related questions.

It can help with:

-   Used-car buying tips
-   Car comparisons
-   Budget-based recommendations
-   Petrol vs. electric decisions
-   RC transfer
-   Car inspection
-   Car loans
-   Maintenance and ownership questions
-   Indian car-market related guidance

The chatbot supports conversation history and provides a responsive chat
interface.

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   React 18
-   Vite
-   React Router
-   Axios
-   React Icons
-   CSS

### Backend

-   Node.js
-   Express.js
-   Mongoose
-   MongoDB
-   CORS
-   dotenv

### AI

-   Google Gemini API
-   `@google/generative-ai`

### Deployment

-   Vercel --- frontend
-   Render --- backend
-   MongoDB Atlas --- database

------------------------------------------------------------------------

## Project Architecture

``` text
                    ┌──────────────────────┐
                    │      React + Vite    │
                    │       Frontend       │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │       Backend        │
                    └───────┬────────┬──────┘
                            │        │
                            │        │
                            ▼        ▼
                   ┌────────────┐  ┌─────────────────┐
                   │  MongoDB   │  │  Google Gemini  │
                   │   Atlas    │  │    AI API       │
                   └────────────┘  └─────────────────┘
```

The frontend communicates with the Express API. The backend handles
authentication, car listings, user data, wishlists, reviews, and chatbot
requests. MongoDB stores application data, while Google Gemini powers
CarBot.

------------------------------------------------------------------------

## Folder Structure

``` text
Car-Wale/
│
├── backend/
│   ├── models/
│   │   ├── Car.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   ├── chatbot.js
│   │   └── user.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AiChatbot.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Toast.jsx
│   │
│   ├── context/
│   │   └── ThemeContext.jsx
│   │
│   ├── data/
│   │   └── carsData.js
│   │
│   ├── pages/
│   │   ├── BuyerHome.jsx
│   │   ├── CarDetail.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── SellerAddCar.jsx
│   │   ├── SellerEditCar.jsx
│   │   ├── SellerHome.jsx
│   │   ├── Signup.jsx
│   │   └── Wishlist.jsx
│   │
│   ├── utils/
│   │   └── language.js
│   │
│   ├── api.js
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── CHATBOT_SETUP.md
```

------------------------------------------------------------------------

## API Endpoints

### Authentication

  Method   Endpoint             Description
  -------- -------------------- ------------------------------
  POST     `/api/auth/signup`   Register a new user
  POST     `/api/auth/login`    Login and validate user role

### Cars

  Method   Endpoint                    Description
  -------- --------------------------- --------------------------------------
  GET      `/api/cars`                 Get active car listings
  GET      `/api/cars/:id`             Get a single car and increment views
  GET      `/api/cars/seller/:email`   Get cars listed by a seller
  POST     `/api/cars`                 Create a car listing
  PUT      `/api/cars/:id`             Update a car listing
  DELETE   `/api/cars/:id`             Delete a car listing
  POST     `/api/cars/:id/reviews`     Add a review

### Users

  -------------------------------------------------------------------------------------
  Method                  Endpoint                              Description
  ----------------------- ------------------------------------- -----------------------
  GET                     `/api/users/:email`                   Get user profile and
                                                                wishlist

  PUT                     `/api/users/:email`                   Update user profile

  POST                    `/api/users/:email/wishlist`          Add a car to wishlist

  DELETE                  `/api/users/:email/wishlist/:carId`   Remove a car from
                                                                wishlist
  -------------------------------------------------------------------------------------

### AI Chat

  Method   Endpoint             Description
  -------- -------------------- ----------------------------
  POST     `/api/chat`          Send a message to CarBot
  GET      `/api/chat/health`   Check Gemini configuration

------------------------------------------------------------------------

## Getting Started

### 1. Clone the repository

``` bash
git clone https://github.com/KARUn077/Car-Wale.git
cd Car-Wale
```

### 2. Install frontend dependencies

``` bash
npm install
```

### 3. Install backend dependencies

``` bash
cd backend
npm install
cd ..
```

------------------------------------------------------------------------

## Environment Variables

Create:

``` text
backend/.env
```

Add:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GOOGLE_AI_API_KEY=your_google_gemini_api_key
```

For local frontend development, the application automatically uses:

``` text
http://localhost:5000/api
```

You can also override the API URL with:

``` env
VITE_API_URL=http://localhost:5000/api
```

For production, the current frontend configuration points to:

``` text
https://car-wale-x3ml.onrender.com/api
```

------------------------------------------------------------------------

## Run Locally

### Start the backend

``` bash
cd backend
npm run dev
```

The backend runs on:

``` text
http://localhost:5000
```

### Start the frontend

Open another terminal:

``` bash
npm run dev
```

The Vite development server will provide the frontend URL, normally:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## MongoDB

The backend supports both MongoDB Atlas and local MongoDB.

### MongoDB Atlas

Set:

``` env
MONGO_URI=mongodb+srv://...
```

### Local MongoDB

If `MONGO_URI` is not available, the backend attempts to connect to:

``` text
mongodb://127.0.0.1:27017/carwale
```

------------------------------------------------------------------------

## Google Gemini Setup

CarBot uses the Google Generative AI SDK.

1.  Create a Gemini API key from Google AI Studio.
2.  Add the key to:

``` text
backend/.env
```

3.  Set:

``` env
GOOGLE_AI_API_KEY=your_api_key
```

4.  Restart the backend.

More chatbot setup details are available in:

``` text
CHATBOT_SETUP.md
```

------------------------------------------------------------------------

## Deployment

### Frontend --- Vercel

Build the React application:

``` bash
npm run build
```

Deploy the project using Vercel.

Set the production API URL if required:

``` env
VITE_API_URL=https://your-backend-url/api
```

### Backend --- Render

The backend can be deployed as a Node.js web service.

Typical configuration:

``` text
Root Directory: backend
Build Command: npm install
Start Command: node server.js
```

Set the required environment variables in Render:

``` env
MONGO_URI=...
GOOGLE_AI_API_KEY=...
```

------------------------------------------------------------------------

## Security Notes

This project is intended as a portfolio/demo application.

Before using it in production, authentication should be strengthened
with:

-   Password hashing using bcrypt/Argon2
-   JWT or secure session-based authentication
-   HTTP-only cookies where appropriate
-   Input validation and sanitization
-   Rate limiting
-   Stronger authorization checks for seller operations
-   Restricted CORS origins
-   Secure environment-variable management
-   API request validation

------------------------------------------------------------------------

## Future Improvements

-   JWT/session authentication
-   Password hashing
-   Image upload with Cloudinary/S3
-   Advanced car recommendation system
-   Persistent chatbot conversations
-   Admin dashboard
-   Advanced analytics
-   Pagination and server-side filtering
-   Car financing/EMI integration
-   Location-based search
-   Notification system
-   More robust role-based authorization

------------------------------------------------------------------------

## Screens / Main Routes

``` text
/login
/signup

/buyer-home
/wishlist
/car/:id
/profile

/seller-home
/seller-add-car
/seller-edit-car/:id
```

------------------------------------------------------------------------

## Author

**Karun Poddar**

Built as a full-stack web development project using React, Node.js,
Express, MongoDB, and Google Gemini AI.

------------------------------------------------------------------------

## License

This project is intended for educational and portfolio purposes.
