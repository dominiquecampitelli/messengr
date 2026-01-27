"use client";

import { useEffect } from "react";

import './styles.css'

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
      <div className="bg-black/90 text-white px-4 py-2 rounded shadow-lg text-sm">
        {message}
      </div>
    </div>
  );
}
