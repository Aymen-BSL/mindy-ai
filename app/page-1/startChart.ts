"use client";
import { useState } from "react";





const startChat = async () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm Mendy, How are you feeling today?", sender: "bot" }
    ]);
    const [userId, setUserId] = useState("");
    const response = await fetch('/start-chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: "Daly Chebbi",
            age: 25,
            conversation_time: 15,
        }),
    });
    const data = await response.json();
    setMessages([{ text: data.first_message, sender: "bot" }]);
    setUserId(data.user_id); // Save user_id for further requests

    localStorage.setItem("userId", data.user_id);
};
