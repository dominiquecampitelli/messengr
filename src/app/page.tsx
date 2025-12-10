"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { io, Socket } from "socket.io-client";

import friendProfile from "../assets/images/rubber-ducky.png";
import myProfile from "../assets/images/friendly-dog.png";

interface ChatMessage {
  id: string;
  content: string;
}

let socket: Socket;

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = io("http://localhost:3002");

    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user-joined", (data: { message: string }) => {
      setMessages((prev) => [...prev, data.message]);
    });

    socket.on("user-left", (data: { message: string }) => {
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("newMessage", input);
      setInput("");
    }
  };

  return (
    <div className="bg-zinc-500 w-full h-screen flex flex-row p-8 md:p-24 gap-8">
      <div className="flex flex-col flex-none justify-between">
        <div className="p-[8px] bg-gradient-to-t from-lime-500 to-transparent rounded-lg w-fit border border-lime-600">
          <Image
            src={friendProfile}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="rounded-md border border-lime-600"
          />
        </div>
        <div className="p-[8px] bg-gradient-to-t from-lime-500 to-transparent rounded-lg w-fit">
          <Image
            src={myProfile}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex-[0.7] bg-white border border-gray-300 p-3 overflow-y-auto rounded-sm">
          {messages.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
        <div className="flex flex-[0.3]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full h-full bg-white text-black rounded-sm pl-3 pr-20"
            />
        </div>
      </div>
    </div>
  );
}
