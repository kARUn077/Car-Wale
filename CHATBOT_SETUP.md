# AI Chatbot Setup Guide for CarWale

## What's been created:

✅ **Frontend Component** - AI Chatbot widget in React
✅ **Backend API** - Express route to handle chat messages  
✅ **Google Gemini Integration** - Generative AI for responses
✅ **UI Added to App** - Chatbot appears in bottom-right corner

---

## Step 1: Get Your Google Gemini API Key

1. Go to **https://ai.google.dev/aistudio**
2. Sign in with your Google account (No credit card needed for free tier)
3. Click **"Get API Key"** 
4. Click **"Create new API key in default project"**
5. Copy the generated API key

---

## Step 2: Add API Key to Backend

1. Open `.env` file in `backend/` folder
2. Find the line: `GOOGLE_AI_API_KEY=your_google_ai_api_key_here`
3. Replace `your_google_ai_api_key_here` with your actual API key
4. Save the file

Example:
```
GOOGLE_AI_API_KEY=AIzaSyD_example_key_here_12345
```

---

## Step 3: Start the Application

### Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Start Frontend:
```bash
npm run dev
```

---

## Step 4: Test the Chatbot

1. Open http://localhost:5173 (or your Vite dev URL)
2. Look for the **purple chat button** in the bottom-right corner
3. Click it to open the chatbot
4. Type a question like:
   - "What should I look for when buying a used car?"
   - "What's the difference between automatic and manual transmission?"
   - "How do I negotiate car prices?"

---

## Files Created/Modified:

### Frontend:
- `src/components/AiChatbot.jsx` - Main chatbot component
- `src/components/AiChatbot.css` - Chatbot styling
- `src/App.jsx` - Added chatbot to all pages

### Backend:
- `backend/routes/chatbot.js` - Chat API route
- `backend/server.js` - Added chatbot route
- `backend/.env` - Added Google AI API key

### Packages Installed:
- Frontend: `axios`
- Backend: `axios`, `@google/generative-ai`

---

## Features:

🤖 **Smart Car Assistant** - Specialized knowledge about car buying
💬 **Real-time Chat** - Instant responses from Google Gemini
💾 **Chat History** - See all messages in conversation
🎨 **Beautiful UI** - Modern, responsive design
📱 **Mobile Friendly** - Works on all device sizes
⏰ **Timestamp** - Know when each message was sent
✨ **Smooth Animations** - Professional interactions

---

## Troubleshooting:

### Chatbot not responding?
- Check that API key is correctly added to `.env`
- Make sure backend is running on port 5000
- Check browser console (F12) for errors

### "AI service not properly configured"?
- Make sure `GOOGLE_AI_API_KEY` is set in `.env`
- Restart the backend server
- Check the API key is valid from Google AI Studio

### CORS errors?
- Backend already has CORS enabled
- Make sure backend is running

---

## Next Steps:

1. **Customize the assistant** - Edit the `SYSTEM_PROMPT` in `backend/routes/chatbot.js`
2. **Add car data context** - Make the AI aware of cars on your platform
3. **Save chat history** - Store conversations in database
4. **Add user authentication** - Link chats to user accounts
5. **Add analytics** - Track popular questions

---

## Support:

If you have issues:
1. Check the terminal for error messages
2. Verify API key is correct
3. Make sure both backend and frontend are running
4. Clear browser cache and refresh (Ctrl+Shift+Delete)

Happy Coding! 🚗✨
