// StartChatComponent.tsx
"use client";

import { useState } from "react";

export default function StartChatComponent() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Mindy, How are you feeling today?", sender: "bot" },
  ]);
  const [userId, setUserId] = useState("");

  const handleStartChat = async () => {
    try {
      const response = await fetch("/start-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Daly Chebbi",
          age: 25,
          conversation_time: "15", // Make sure this is a string
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start chat");
      }

      const data = await response.json();
      // Update state with the new message and userId
      setMessages([{ text: data.first_message, sender: "bot" }]);
      setUserId(data.user_id);
      localStorage.setItem("userId", data.user_id);
    } catch (error) {
      console.error(error);
      alert("Failed to start chat.");
    }
  };

  return (
    <div>
      <button onClick={handleStartChat}>Start Chat</button>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}
