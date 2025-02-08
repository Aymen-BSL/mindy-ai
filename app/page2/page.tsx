"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, SendHorizonal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useRouter } from "next/navigation";

import { useChat } from "../context/ChatContext";
import HandleSendMessage from "./HandleSendMessage";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatbotApp() {
  const router = useRouter();
  const { messages, setMessages, userId, setUserId } = useChat();
  const [allMessages, setAllMessages] = useState([...messages]);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const userMessage: Message = { text: input, sender: "user" };
    setAllMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(async () => {
      const response = await HandleSendMessage(userMessage.text);
      if (response === "GOODBYE") {
        router.replace("/report");
      }
      const botMessage: Message = { text: response, sender: "bot" };
      setAllMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center max-h-screen w-screen p-6">
      <Card className="w-1/2 h-screen shadow-lg overflow-x-hidden">
        <CardContent className="h-full p-4 space-y-4">
          <ScrollArea className="flex-1 h-[80%] rounded-lg p-2">
            <div className="h-full overflow-y-auto">
              {allMessages.map((msg, index) => (
                <div key={index} className="flex-col items-start gap-2">
                  {msg.sender === "user" ? (
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-lg rounded-br-none my-1 min-w-[] p-4 bg-blue-500 text-white break-words ml-auto mr-8`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <div
                        className={`rounded-lg rounded-bl-none my-1 ml-11 max-w-xs p-4 bg-gray-300 text-black break-words whitespace-pre-wrap`}
                      >
                        {msg.text}
                      </div>
                      <Avatar className="mt-[-1rem]">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="w-full flex justify-center items-center gap-2 mb-0 mt-auto">
            <Textarea
              placeholder="Type your message here."
              value={input}
              className="flex-1 max-w-[70%] min-h-24 mt-auto mb-0 resize-none rounded-lg"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-transparent border-none"
            >
              <SendHorizonal size={30} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
