"use client";

import { useState } from "react";
import { playPurr } from "@/utils/audio";
import FloatingElement from "./FloatingElement";
import { Heart } from "lucide-react";

export default function InteractiveCat() {
  const [isPurring, setIsPurring] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePet = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPurring) return; // Don't interrupt an active purr
    
    setIsPurring(true);
    playPurr();
    
    // Create floating hearts at the click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 12; // center offset
    const y = e.clientY - rect.top - 12;

    const newHeart = { id: Date.now(), x, y };
    setHearts(prev => [...prev.slice(-4), newHeart]);

    // Reset purr state after sound finishes (2.5s)
    setTimeout(() => {
      setIsPurring(false);
    }, 2500);
    
    // Remove heart after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  return (
    <div className="relative flex flex-col items-center">
      <FloatingElement yOffset={4} duration={4}>
        <div 
          onClick={handlePet}
          className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 shadow-xl cursor-pointer transition-all duration-300 ${isPurring ? 'scale-110 bg-pink-100/30' : 'hover:scale-105 hover:bg-white/30'} select-none`}
          title="Pet Priya's cat buddy!"
        >
          {/* Subtle heartbeat animation when purring */}
          <span 
            className={`text-3xl md:text-4xl drop-shadow-md select-none ${isPurring ? 'animate-pulse scale-110' : ''}`}
            role="img" 
            aria-label="Pettable Cat"
          >
            {isPurring ? "😸" : "😺"}
          </span>
          
          {/* Floating Hearts */}
          {hearts.map(heart => (
            <div 
              key={heart.id} 
              className="absolute pointer-events-none animate-float-up text-pink-500"
              style={{ left: heart.x, top: heart.y }}
            >
              <Heart className="w-5 h-5 fill-current animate-pulse opacity-90" />
            </div>
          ))}
        </div>
      </FloatingElement>

      {/* Glassmorphic prompt text bubble above the cat */}
      <div className="absolute bottom-full mb-3 px-3 py-1 bg-white/25 backdrop-blur-sm border border-white/20 rounded-lg shadow-md text-xs font-sans italic text-foreground/80 pointer-events-none transition-all duration-300 opacity-90 animate-pulse whitespace-nowrap">
        {isPurring ? "*purrrrr* 💖" : "Pet me! 🐾"}
      </div>
    </div>
  );
}
