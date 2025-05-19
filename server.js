// backend/server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint to handle chat messages
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  try {
    // Use Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    // Generate response
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    res.status(500).json({ reply: "Something went wrong with Gemini API." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});



