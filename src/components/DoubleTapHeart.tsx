"use client";

import { useEffect, useState } from "react";
import { playPop } from "@/utils/audio";

const celebrationEmojis = ["✨", "🌟", "🎉", "🍰", "🎈"];

export default function DoubleTapHeart() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastTap = 0;

    const handleTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTap < 400) {
        // Double tap detected!
        const touch = e.changedTouches[0];
        const x = touch.clientX;
        const y = touch.clientY;

        const heartId = Date.now();
        const emoji = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
        setHearts(prev => [...prev.slice(-5), { id: heartId, x, y, emoji }]);
        playPop();

        // Haptic
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }

        // Remove emoji after animation
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== heartId));
        }, 2000);
      }
      lastTap = now;
    };

    window.addEventListener("touchend", handleTap, { passive: true });

    return () => {
      window.removeEventListener("touchend", handleTap);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[90]">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: heart.x - 30,
            top: heart.y - 30,
          }}
        >
          <span className="text-6xl drop-shadow-lg" role="img" aria-label="Celebration Element">
            {heart.emoji}
          </span>
        </div>
      ))}
    </div>
  );
}
