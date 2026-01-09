"use client";

interface RoomFullProps {
  title?: string;
  description: string;
  buttonText?: string;
  onClose: () => void;
}

export function RoomFull({
  title = "Erro",
  description,
  buttonText = "Fechar",
  onClose,
}: RoomFullProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-red-600 bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold text-red-600">
          {title}
        </h2>

        <p className="mb-6 text-sm text-stone-700">
          {description}
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
