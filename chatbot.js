import React, { useState } from "react";
import "./index.css"; // Make sure this is imported

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [botReply, setBotReply] = useState("");
  const [file, setFile] = useState(null);

  const handleSend = async () => {
    if (!userInput && !file) {
      alert("Please enter a message or attach a file.");
      return;
    }

    const formData = new FormData();
    formData.append("message", userInput);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setBotReply(data.reply);
      setUserInput("");
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      setBotReply("Sorry, something went wrong.");
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">🤖 Chat with Bot</h2>

      <div className="chat-box">
        <textarea
          className="chat-input"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={3}
        />

        <div className="chat-actions">
          <label className="upload-btn">
            📎 Attach
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          <button className="send-btn" onClick={handleSend}>
            🚀 Send
          </button>
        </div>

        {file && <div className="file-preview">Attached: {file.name}</div>}
        {botReply && (
          <div className="bot-reply">
            <strong>Bot:</strong> {botReply}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbot;


