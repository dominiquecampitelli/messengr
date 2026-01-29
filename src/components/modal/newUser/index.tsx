"use client";

import { useState } from "react";

interface UserModalProps {
  onSubmit: (name: string) => void;
}

export function UserModal({ onSubmit }: UserModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg p-6 w-[320px] shadow-xl">
        <h1 className="text-lg font-semibold mb-4 text-black">
          Digite seu nome
        </h1>

        <input
          value={name}
          placeholder="Seu nome"
          className="w-full border border-gray-300 rounded p-2 mb-4 text-black"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700 transition"
        >
          Entrar no chat
        </button>
      </div>
    </div>
  );
}
