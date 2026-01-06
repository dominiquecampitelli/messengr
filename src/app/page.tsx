"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { io, Socket } from "socket.io-client";

import banner from "../assets/images/graffiti-wlm.jpg";
import friendProfile from "../assets/images/skateboarder.png";
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
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <div className="absolute top-0 left-0 w-full h-[155px] z-0">
        <Image
          src={banner}
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[220px] z-0 bg-gradient-to-t from-stone-300 to-transparent" />
      <div className="relative z-10 w-full h-full flex flex-row p-8 md:p-24 gap-8">
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
          <div className="p-[8px] bg-gradient-to-t from-lime-500 to-transparent rounded-lg w-fit border border-lime-600">
            <Image
              src={myProfile}
              alt="Foto de perfil"
              width={100}
              height={100}
              className="rounded-md border border-lime-600"
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex flex-col">
            <h1
              className="text-lg font-medium text-black"
              style={{
                textShadow: "0 0 5px rgba(255,255,255,0.9)",
              }}
            >
              Dominicus
            </h1>
            <p
              className="text-base text-black"
              style={{
                textShadow: "0 0 5px rgba(255,255,255,0.9)",
              }}
            >
              Salve o planeta
            </p>
          </div>
          <div className="flex-[0.7] bg-white overflow-y-auto rounded-sm text-base text-black">
            {messages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
          <div className="flex flex-[0.3]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full h-full bg-white border border-gray-300 text-base text-black rounded-sm p-3 py-2 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
