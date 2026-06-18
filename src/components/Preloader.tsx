"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Give 3D scene time to load, then fade out
    const timer = setTimeout(() => {
      gsap.to(".preloader-container", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          setVisible(false);
          onComplete();
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="preloader-container fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-[#ffe4e1] via-[#fff0f5] to-[#e6e6fa]">
      {/* Pulsing gift icon */}
      <div className="animate-bounce">
        <span className="text-8xl drop-shadow-xl" role="img" aria-label="Gift">
          🎁
        </span>
      </div>
      
      <p className="mt-8 font-serif text-2xl text-foreground/70 italic tracking-wide animate-pulse">
        Preparing something special...
      </p>
      
      {/* Subtle loading dots */}
      <div className="mt-6 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-500"
            style={{
              animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
