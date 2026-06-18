"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { playPop } from "@/utils/audio";

// Ensure plugin registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface NoteCardProps {
  message: string;
  index: number;
  align?: "left" | "right" | "center";
}

export default function NoteCard({ message, index, align = "center" }: NoteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Small delay on mount if ScrollTrigger calculates too fast
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          {
            y: 100,
            opacity: 0,
            rotationZ: index % 2 === 0 ? -5 : 5, // polaroid tilt
            scale: 0.95,
          },
          {
            y: 0,
            opacity: 1,
            rotationZ: index % 2 === 0 ? -2 : 2, // Rest at slight angle
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse", // allowing replay on scroll up
            },
          }
        );
      });
      return () => ctx.revert();
    }
  }, [index]);

  const alignClass = 
    align === "left" ? "mr-auto ml-4 md:ml-[15%]" : 
    align === "right" ? "ml-auto mr-4 md:mr-[15%]" : 
    "mx-auto";

  return (
    <div 
      ref={cardRef} 
      onClick={() => playPop()}
      className={`w-[90%] md:w-[60%] lg:w-[45%] p-8 md:p-12 my-[10vh] rounded-[2rem] bg-white/50 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,182,193,0.3)] border border-white/60 ${alignClass} transition-transform hover:scale-[1.03] active:scale-95 duration-300 cursor-pointer`}
      title="Tap me!"
    >
      <p className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed text-center pointer-events-none select-none">
        {message}
      </p>
    </div>
  );
}
