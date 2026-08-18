require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const userRoutes = require('./routes/user');
const chatbotRoutes = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 5000;
const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/carwale';
const MONGO_URIS = [process.env.MONGO_URI, LOCAL_MONGO_URI].filter(Boolean);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatbotRoutes);

async function connectMongo() {
  let lastError = null;

  for (const uri of MONGO_URIS) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`Connected to MongoDB: ${uri.includes('mongodb+srv') ? 'Atlas' : 'Local'}`);
      return;
    } catch (err) {
      lastError = err;
      console.error(`MongoDB connection failed for ${uri}:`, err.message);
    }
  }

  console.error('All MongoDB connection attempts failed.');
  console.error(lastError?.stack || lastError);
}

connectMongo();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
