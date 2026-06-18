import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import gsap from "gsap";

interface CelebrationProps {
  isOpened: boolean;
  onSequenceComplete: () => void;
}

export default function Celebration({
  isOpened,
  onSequenceComplete,
}: CelebrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);
  const [scrolled, setScrolled] = useState(false);

  const splitText = "Happy Birthday Priya!".split("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpened && !hasRun.current) {
      hasRun.current = true;
      // 1. Fire Confetti (delayed to match box pop)
      setTimeout(() => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#ffb6c1", "#ffd700", "#ff69b4"],
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#ffb6c1", "#ffd700", "#ff69b4"],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }, 2000);

      // 2. Animate Typography (delayed to match box pop)
      if (textRef.current && containerRef.current && elementsRef.current) {
        gsap.to(containerRef.current, { autoAlpha: 1, duration: 0.5, delay: 2.0 });

        const chars = textRef.current.querySelectorAll(".char");

        gsap.fromTo(
          chars,
          { y: 100, opacity: 0, rotationX: -90 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 2.5,
            onComplete: () => {
              // Apply shimmer to the h1 text
              if (textRef.current) {
                textRef.current.classList.add("text-shimmer");
              }
              // Show the scroll instruction after text finishes
              gsap.to(elementsRef.current, {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
              });
              onSequenceComplete();
            },
          },
        );
      }
    }
  }, [isOpened, onSequenceComplete]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-[100dvh] z-[40] flex flex-col justify-center items-center pointer-events-none opacity-0 invisible"
    >
      <h1
        ref={textRef}
        className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-primary-500 font-bold drop-shadow-lg text-center leading-tight perspective-1000"
      >
        {splitText.map((char, i) => (
          <span key={i} className="char inline-block whitespace-pre">
            {char}
          </span>
        ))}
      </h1>

      {/* Scroll prompt */}
      <div
        ref={elementsRef}
        className="mt-12 flex flex-col items-center opacity-0 invisible translate-y-8 pointer-events-auto"
      >
        <div className={`mt-10 animate-bounce flex flex-col items-center transition-opacity duration-500 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <p className="text-foreground/70 font-serif text-lg italic drop-shadow-sm">
            Scroll for more
          </p>
          <span className="text-2xl text-foreground/50 mt-1">↓</span>
        </div>
      </div>
    </div>
  );
}
