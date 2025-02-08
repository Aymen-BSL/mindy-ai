"use client";


import { useChat } from "../context/ChatContext";

export default function HandleSendMessage() {
    const { messages } = useChat();

    return (
        <div>
            {messages.map((message, index) => (
                <div key={index} className={message.sender === "user" ? "text-right" : "text-left"}>
                    <p>{message.text}</p>
                </div>
            ))}
        </div>
    );
}




// import firstMessage from "../page1/StartCharts";

// const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { text: input, sender: "user" };


//     const response = await fetch('/get-chat-response', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             user_id: userId, // Ensure you save the user ID from /start-chat
//             message: input,
//         }),
//     });

//     const botMessage = await response.text();
//     setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
//     return messages;
// };



