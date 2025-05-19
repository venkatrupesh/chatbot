import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// ----- ChatMessage Component -----
function ChatMessage({ message }) {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {message}
    </ReactMarkdown>
  );
}

// ----- Auth Component -----
function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (isLogin && email && password) ||
      (!isLogin && name && email && password)
    ) {
      navigate("/chat");
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleOAuth = (provider) => {
    alert(`${provider} login is mocked.`);
    navigate("/chat");
  };

  const containerStyle = {
    height: "100vh",
    background: "linear-gradient(to right, #141e30, #243b55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const boxStyle = {
    background: "#fff",
    padding: "2rem",
    width: "350px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
  };

  const socialBtnStyle = (bgColor) => ({
    ...buttonStyle,
    backgroundColor: bgColor,
    marginTop: "8px",
  });

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <button
          style={socialBtnStyle("#3b5998")}
          onClick={() => handleOAuth("Facebook")}
        >
          Sign in with Facebook
        </button>
        <button
          style={socialBtnStyle("#333")}
          onClick={() => handleOAuth("GitHub")}
        >
          Sign in with GitHub
        </button>

        <p style={{ marginTop: "1rem" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ----- Chatbot Component -----
function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [botReply, setBotReply] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      setBotReply(data.reply);
    } catch (error) {
      console.error("Error:", error);
      setBotReply("Sorry, something went wrong.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>ChatGPT Clone</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something..."
          rows={5}
          style={{
            flex: 1,
            padding: "15px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "none",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            height: "fit-content",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          Send
        </button>
      </div>

      <div style={{ fontSize: "18px", lineHeight: "1.6" }}>
        <strong>GPT:</strong>
        <ChatMessage message={botReply} />
      </div>
    </div>
  );
}

// ----- Main App -----
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;




