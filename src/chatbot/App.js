import React, { useState } from 'react';
import './App.css'; // You can create a simple CSS file for styling

function App() {

  const [messages, setMessages] =
      useState(
          [
              {
                sender: 'bot',
                text: 'Hello! How can I help you today?'
              }
              ]
      );

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add the user message to the chat
    const newMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Get the bot response asynchronously
    getBotResponse(input);

    setInput(''); // Clear the input field
  };

  // A simple bot response logic
  const getBotResponse = async (userMessage) => {
    const encodedMessage = encodeURIComponent(userMessage);
    const url = "http://localhost:8080/chat?userQuery=" + encodedMessage;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': '*/*'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.text(); // Or res.json() if your API returns JSON
      console.log(data); // Log the response for debugging

      // Add the bot's reply to the chat after receiving the response
      const botReply = {
        sender: 'bot',
        text: data || 'Sorry, I did not get that.'
      };

      // Update the chat with the bot's response
      setMessages((prevMessages) => [...prevMessages, botReply]);

    } catch (error) {
      console.error('Fetch error:', error);

      // Add an error message from the bot if the fetch fails
      const errorReply = {
        sender: 'bot',
        text: 'Sorry, there was an error processing your request.'
      };
      setMessages((prevMessages) => [...prevMessages, errorReply]);
    }
  };

  return (
      <div className="chat-container">
        <div className="chat-box">
          {
            messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
          ))}
        </div>

        <div className="chat-input">
          <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
  );
}

export default App;
