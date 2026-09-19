# CarWale Clone
This is a full-stack CarWale clone where users can buy and sell used or new cars. It includes separate features for buyers and sellers, along with an AI Chatbot to help users choose the right car.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB
- AI Chatbot: Google Gemini API

## Main Features

## Buyer 
- Search and filter cars (by Brand, Price, Fuel, etc.).
- View complete car details (Photos, Price, Reviews, EMI).
- Save favorite cars to the 'Wishlist'.
- Compare 2 cars side-by-side.
- Get car buying advice from the AI Chatbot.
- View the seller's contact number.

## Seller 
- List a car for sale (with photos and details).
- Edit or delete existing car listings.
- Access a dedicated seller dashboard to manage all cars.

## General
- Toggle between English and Hindi languages.
- Dark and Light theme support.
- User Profile dashboard (account details and settings).

## System Architecture 

This website is built on the **MERN Stack** (MongoDB, Express, React, Node.js). It follows a simple Client-Server architecture:

**1. Client Side (Frontend)**
- Built with React (Vite) as a Single Page Application (SPA), which means the page doesn't reload during navigation.
- Uses React Hooks (`useState`, `useEffect`, `useContext`) for state management.
- Uses `react-router-dom` for routing, including Protected Routes so private pages cannot be accessed without logging in.

**2. Server Side (Backend)**
- API server built with Node.js and Express.js.
- Uses RESTful APIs to send and receive data from the frontend (like car lists, login, signup, and reviews).
- CORS is set up to allow the frontend to easily communicate with the backend APIs.

**3. Database**
- Uses MongoDB (NoSQL) to store all data.
- Uses the Mongoose library to define data models (`User`, `Car`).

**4. External Service (AI Integration)**
- The AI Chatbot calls the Google Gemini API from the backend. The frontend sends the user's message to the backend, and the backend talks to Gemini and sends the reply back. This keeps the API key secure.

## How to Run the Project

1. Database Setup
Make sure MongoDB is installed and running on your system (Local `mongodb://127.0.0.1:27017/carwale`).

2. Start the Backend
Open a terminal, go to the `backend` folder, and run:
```bash
cd backend
npm install
npm run dev
```

3. Start the Frontend
Open another terminal, stay in the main folder (CarWale), and run:
```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to view the website.

## Env Variables 
Create a `.env` file inside the `backend` folder and add these variables:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/carwale
GOOGLE_AI_API_KEY=your_gemini_api_key_here
```
