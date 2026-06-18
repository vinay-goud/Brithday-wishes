"use client";

import { useEffect, useState } from "react";

const hueRotations = [0, 30, 60, 120, 180, 240, 300];

type Balloon = { id: number; x: number; y: number; hue: number };

export default function BalloonRelease() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    let touchPos = { x: 0, y: 0 };

    const handleStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchPos = { x: touch.clientX, y: touch.clientY };
      
      holdTimer = setTimeout(() => {
        // Long press detected! Spawn a balloon
        const hue = hueRotations[Math.floor(Math.random() * hueRotations.length)];
        const balloon: Balloon = {
          id: Date.now(),
          x: touchPos.x,
          y: touchPos.y,
          hue,
        };
        
        setBalloons(prev => [...prev.slice(-8), balloon]);
        
        // Haptic
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        
        // Remove balloon after float-up animation
        setTimeout(() => {
          setBalloons(prev => prev.filter(b => b.id !== balloon.id));
        }, 4000);
      }, 500);
    };

    const handleEnd = () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    };

    const handleMove = () => {
      // Cancel if finger moves (only trigger on hold-still)
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    };

    window.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchend", handleEnd, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      if (holdTimer) clearTimeout(holdTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[85]">
      {balloons.map(balloon => (
        <div
          key={balloon.id}
          className="absolute"
          style={{
            left: balloon.x - 25,
            top: balloon.y - 25,
            animation: "balloon-float 4s ease-out forwards",
            filter: `hue-rotate(${balloon.hue}deg)`,
          }}
        >
          <span className="text-5xl drop-shadow-lg">🎈</span>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes balloon-float {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          30% {
            transform: translateY(-150px) rotate(-8deg) scale(1.1);
            opacity: 1;
          }
          70% {
            transform: translateY(-400px) rotate(5deg) scale(1.15);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-700px) rotate(-3deg) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
