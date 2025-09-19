"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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
    <div style={{ padding: 20 }}>
      <h1>Chat Terra</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: "300px",
          overflowY: "scroll",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua mensagem..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", marginRight: 10 }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}
