"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const roomId = nanoid(8);
    router.replace(`/chat/${roomId}`);
  }, [router]);

  return null;
}
