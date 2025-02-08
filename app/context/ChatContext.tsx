"use client";

import React, { createContext, useState, useContext } from "react";

// Define types for the context
interface Message {
  text: string;
  sender: "bot" | "user";
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create a provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Mindy, How are you feeling today?", sender: "bot" },
  ]);
  const [userId, setUserId] = useState<string>("");

  return (
    <ChatContext.Provider value={{ messages, setMessages, userId, setUserId }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the ChatContext
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
