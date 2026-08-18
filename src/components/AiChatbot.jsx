import { API_URL } from '../api'
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import './AiChatbot.css';

// Simple markdown-to-HTML renderer (no external lib needed)
const renderMarkdown = (text) => {
  if (!text) return '';
  return text
    // Bold **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Bullet points starting with - or *
    .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
};

const QUICK_SUGGESTIONS = [
  '🚗 Used car kharidne ke tips?',
  '💰 Budget ₹5-10L mein best car?',
  '⚡ Petrol vs Electric car?',
  '📋 RC transfer kaise kare?',
  '🔧 Car inspection checklist',
  '💳 Car loan tips',
];

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Namaste! 🙏 Main **CarBot** hoon — aapka personal Car Buying Assistant!\n\nCar kharidne ya bechne mein koi bhi sawaal poochho, main help karunga. 🚗',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;

    setShowSuggestions(false);

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Send conversation history for multi-turn context
      const history = updatedMessages.slice(1).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await axios.post(`${API_URL}/chat`, {
        message: text.trim(),
        history: history.slice(0, -1) // exclude the last user message (sent as message)
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply || "Kuch problem aa gayi. Please dobara try karo.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errText = error.response?.data?.error || "Sorry, server se connect nahi ho pa raha. Backend chalaa ke dekho.";
      const errorMessage = {
        id: Date.now() + 1,
        text: `❌ ${errText}`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: 'Namaste! 🙏 Main **CarBot** hoon — aapka personal Car Buying Assistant!\n\nCar kharidne ya bechne mein koi bhi sawaal poochho, main help karunga. 🚗',
      sender: 'bot',
      timestamp: new Date()
    }]);
    setShowSuggestions(true);
  };

  return (
    <div className="ai-chatbot">
      {/* Floating Chat Button */}
      <button
        className={`chat-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => { setIsOpen(!isOpen); setIsMinimized(false); }}
        title="Chat with CarBot AI"
        aria-label="Open AI Chat Assistant"
      >
        {isOpen ? <FiX size={22} /> : <BsRobot size={24} />}
        {!isOpen && <span className="chat-badge">AI</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chat-header">
            <div className="header-left">
              <div className="bot-avatar">
                <BsRobot size={18} />
              </div>
              <div className="header-info">
                <span className="header-name">CarBot AI</span>
                <span className="header-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="header-btn"
                onClick={clearChat}
                title="Clear chat"
              >
                🗑️
              </button>
              <button
                className="header-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <FiMinimize2 size={14} />
              </button>
              <button
                className="header-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Body (hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="messages-container">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="bot-msg-avatar">
                        <BsRobot size={13} />
                      </div>
                    )}
                    <div className="message-bubble">
                      <div
                        className="message-content"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                      />
                      <span className="message-time">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <div className="message bot">
                    <div className="bot-msg-avatar">
                      <BsRobot size={13} />
                    </div>
                    <div className="message-bubble">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Suggestions */}
                {showSuggestions && messages.length <= 1 && (
                  <div className="suggestions-container">
                    <p className="suggestions-label">Kuch common sawaal:</p>
                    <div className="suggestions-grid">
                      {QUICK_SUGGESTIONS.map((s, i) => (
                        <button
                          key={i}
                          className="suggestion-chip"
                          onClick={() => handleSuggestionClick(s)}
                          disabled={loading}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input-wrapper">
                <div className="chat-input-container">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Car ke baare mein kuch bhi poochho..."
                    disabled={loading}
                    rows="1"
                    className="chat-textarea"
                  />
                  <button
                    className="send-button"
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    title="Send message"
                  >
                    <FiSend size={16} />
                  </button>
                </div>
                <p className="powered-by">Powered by Google Gemini AI</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
