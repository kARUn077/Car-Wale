const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// System prompt for car buying assistant
const SYSTEM_PROMPT = `You are CarBot, an expert AI Car Buying Assistant for CarWale — India's trusted online car marketplace.

Your role is to help users make smart, informed decisions about buying and selling cars.

Guidelines:
- Help users with car selection based on their budget, needs, and preferences
- Explain features, specifications, engine types, fuel efficiency, and maintenance costs
- Compare different car models (Indian market: Maruti, Hyundai, Tata, Honda, Toyota, etc.)
- Suggest the right questions to ask sellers before buying
- Provide negotiation tips and price guidance
- Explain RC transfer, insurance, loan, and other documentation for car purchases
- For used cars: explain inspection checklist, things to watch out for
- Keep responses concise and clear. Use bullet points for lists.
- Be friendly, helpful, and encouraging
- If someone asks something unrelated to cars, politely redirect them to car-related topics
- Always prioritize the user's safety and financial interests
- Respond in the same language the user writes in (Hindi or English)

You are an expert in the Indian car market. Be specific with Indian prices in INR (₹).`;

// POST /api/chat - Handle chat messages
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey || apiKey === 'your_google_ai_api_key_here') {
      return res.status(500).json({
        error: 'AI API key not configured. Please add GOOGLE_AI_API_KEY to backend/.env'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use gemini-2.5-flash — fast, free tier supported
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    // Build chat history for multi-turn conversation
    const chatHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    res.json({
      reply,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      return res.status(500).json({ error: 'Invalid or missing Gemini API key. Check backend/.env' });
    }

    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    }

    if (
      error.message?.includes('503') ||
      error.message?.includes('Service Unavailable') ||
      error.message?.includes('high demand')
    ) {
      return res.status(503).json({
        error: 'AI service is temporarily busy. Please try again in a few seconds.'
      });
    }

    res.status(500).json({
      error: 'Failed to process your message. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/chat/health - Health check
router.get('/health', (req, res) => {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  const configured = !!apiKey && apiKey !== 'your_google_ai_api_key_here';
  res.json({
    status: 'ok',
    aiServiceConfigured: configured
  });
});

module.exports = router;
