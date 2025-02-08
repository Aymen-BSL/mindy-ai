"use client";
import { useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useRouter } from "next/navigation";


interface userProps {
    name: string;
    age: number;
    conversation_time: string;
}

export default function StartChat({ name, age, conversation_time }: userProps) {
    const { messages, setMessages, userId, setUserId } = useChat();
    const router = useRouter();

    useEffect(() => {

        const handleStartChat = async () => {

            try {

                const response = await fetch("https://3b90-41-226-8-251.ngrok-free.app/start-chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        age: age,
                        conversation_time: conversation_time,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to start chat");
                }

                const data = await response.json();
                console.log(data);
                setMessages([{ text: data.first_message, sender: "bot" }]);
                setUserId(data.user_id);
                console.log(data.user_id);
                console.log(data.first_message);
                localStorage.setItem("userId", data.user_id);
                router.replace("/page2");
            } catch (error) {
                console.error(error);
                alert("Failed to start chat.");
            }


        }
        handleStartChat();
    }, [name, age, conversation_time, messages]);
    return null
}
