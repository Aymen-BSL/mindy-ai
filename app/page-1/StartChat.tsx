// StartChatComponent.tsx
"use client";
import { useState } from "react";

interface userProps {
  name: string;
  age: number;
  conversation_time: string;
}

export default function StartChat({ name, age, conversation_time }: userProps) {
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
          name: name,
          age: age,
          conversation_time: conversation_time, // Make sure this is a string
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
}
