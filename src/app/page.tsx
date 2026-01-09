"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { io, Socket } from "socket.io-client";

import { UserModal } from "../components/modal/newUser";
import { RoomFull } from "../components/modal/roomFull";

import banner from "../assets/images/graffiti-wlm.jpg";
import friendProfile from "../assets/images/skateboarder.png";
import myProfile from "../assets/images/friendly-dog.png";

interface StatusPayload {
  user: string;
  status: "online" | "offline";
}

interface ChatMessage {
  user: string;
  message: string;
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);

  const [userName, setUserName] = useState<string>("");
  const [otherUserName, setOtherUserName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [roomFull, setRoomFull] = useState(false);
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3002", { autoConnect: false });
    socketRef.current = socket;

    socket.on("room-status", ({ status }) => {
      if (status === "full") {
        setRoomFull(true);
      } else {
        setCanJoin(true);
      }
    });

    socket.on("room-full", () => {
      setRoomFull(true);
      socket.disconnect();
    });

    socket.on("message", (payload: ChatMessage) => {
      if (payload.user !== userName && !otherUserName) {
        setOtherUserName(payload.user);
      }

      setMessages((prev) => [...prev, payload]);
    });

    socket.on("user-joined", (payload: StatusPayload) => {
      if (payload.user !== userName) {
        setOtherUserName(payload.user);
      }

      setMessages((prev) => [
        ...prev,
        {
          user: payload.user,
          message: "entrou no chat",
        },
      ]);
    });

    socket.on("user-left", (payload: StatusPayload) => {
      setOtherUserName((current) =>
        current === payload.user ? null : current
      );

      setMessages((prev) => [
        ...prev,
        {
          user: payload.user,
          message: "saiu do chat",
        },
      ]);
    });

    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!userName || roomFull || !socketRef.current) return;

    socketRef.current.emit("join", userName);
  }, [userName, roomFull]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.emit("newMessage", input);
    setInput("");
  };

  return (
    <>
      {roomFull && (
        <RoomFull
          title="Sala cheia"
          description="Este chat permite apenas 2 usuários conectados ao mesmo tempo."
          buttonText="Voltar mais tarde"
          onClose={() => {
            setRoomFull(false);
            setUserName("");
            setMessages([]);
            setOtherUserName(null);
          }}
        />
      )}

      {canJoin && !userName && !roomFull && (
        <UserModal onSubmit={setUserName} />
      )}

      {!roomFull && userName && (
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
          <div className="relative z-10 w-full h-full flex flex-row p-8 md:p-24 gap-9">
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
              <h1
                className="mb-5 text-lg font-medium text-black"
                style={{
                  textShadow: "0 0 5px rgba(255,255,255,0.9)",
                }}
              >
                {otherUserName ?? "Aguardando usuário..."}
              </h1>
              <div className="flex-[0.7] bg-white overflow-y-auto rounded-sm text-base text-black">
                {messages.map((msg, i) => (
                  <div key={i} className="mb-4">
                    <p className="text-base font-medium text-stone-500">
                      {msg.user}:
                    </p>
                    <p className="text-base font-medium text-black pl-4">
                      {msg.message}
                    </p>
                  </div>
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
      )}
    </>
  );
}
