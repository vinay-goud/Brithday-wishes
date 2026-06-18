"use client";

import { useState, useCallback } from "react";
import Experience from "@/components/Experience";
import Celebration from "@/components/Celebration";
import NoteCard from "@/components/NoteCard";
import FloatingElement from "@/components/FloatingElement";
import LanternRelease from "@/components/LanternRelease";
import Preloader from "@/components/Preloader";
import Fireflies from "@/components/Fireflies";
import InteractiveCat from "@/components/InteractiveCat";
import { playBGM, playPop, vibrate } from "@/utils/audio";
import confetti from "canvas-confetti";

const notes: { message: string; align: "left" | "right" | "center"; graphic?: React.ReactNode }[] = [
  { 
    message: "Happy Birthday Priya! 🎉 I really hope your day is as amazing and special as you are.", 
    align: "center", 
    graphic: <FloatingElement delay={0} yOffset={15}><span className="text-6xl drop-shadow-lg">🐱</span></FloatingElement> 
  },
  { 
    message: "You always manage to bring so much light and joy to everyone around you. Please never stop being you. ✨", 
    align: "left", 
    graphic: <FloatingElement delay={0.5} yOffset={-20}><span className="text-6xl drop-shadow-lg">🌟</span></FloatingElement> 
  },
  { 
    message: "Every moment of our friendship is a beautiful memory. Here's to making many more together! 🌸", 
    align: "right", 
    graphic: <FloatingElement delay={0.3} yOffset={12}><span className="text-6xl drop-shadow-lg">🦋</span></FloatingElement> 
  },
  { 
    message: "Thanks for always being the person I can count on, no matter what. You're a truly wonderful friend. 💛", 
    align: "left", 
    graphic: <FloatingElement delay={0.8} yOffset={-15}><span className="text-6xl drop-shadow-lg">👑</span></FloatingElement> 
  },
  { 
    message: "I hope this new chapter brings you closer to all your dreams. You deserve the absolute best. 🌍", 
    align: "center", 
    graphic: <FloatingElement delay={0.6} yOffset={-18}><span className="text-6xl drop-shadow-lg">🌺</span></FloatingElement> 
  },
  { 
    message: "Never forget how much your friendship is appreciated. Enjoy your special day to the absolute fullest! 🎂", 
    align: "center", 
    graphic: null 
  }
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [wished, setWished] = useState(false);
  const [showFireflies, setShowFireflies] = useState(false);

  const handleOpen = useCallback(() => {
    if (isOpened) return;
    setIsOpened(true);
    playPop();
    vibrate(200); // Haptic on box open
    
    setTimeout(() => {
      playBGM();
      setShowFireflies(true); // Start fireflies after box opens
    }, 600);
  }, [isOpened]);

  const handleMakeWish = () => {
    if (wished) return;
    setWished(true);
    playPop();
    vibrate(150); // Haptic on wish
    
    // Huge Confetti blast for the wish
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#ffb6c1", "#ffd700", "#ff69b4"]
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#ffb6c1", "#ffd700", "#ff69b4"]
      });
    }, 250);
  };

  return (
    <main className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col items-center">
      {/* Preloader */}
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      
      {/* Lantern Release (appears after wish) */}
      <LanternRelease active={wished} />
      
      {/* Ambient Fireflies (appear after box opens) */}
      {showFireflies && <Fireflies />}
      
      {/* 3D Gift Box Scene */}
      <div className={`fixed inset-0 z-0 pointer-events-auto transition-opacity duration-1000 ${showNotes ? 'opacity-30' : 'opacity-100'}`}>
        <Experience isOpened={isOpened} onOpen={handleOpen} />
      </div>
      
      {/* Celebration overlay */}
      <Celebration isOpened={isOpened} onSequenceComplete={() => setShowNotes(true)} />
      
      {/* Tap prompt */}
      {!isOpened && loaded && (
        <div className="absolute inset-x-0 bottom-32 flex justify-center items-center z-10 pointer-events-none">
          <p className="text-foreground font-serif text-2xl animate-pulse tracking-wide drop-shadow-md">
            Tap to open a surprise 🎁
          </p>
        </div>
      )}
      
      {/* Scrolling Notes Journey */}
      {showNotes && (
        <div className="relative z-30 flex flex-col items-center w-full mt-[15vh] md:mt-[30vh]">

          <div className="w-full max-w-6xl mx-auto pb-[10vh]">
            {notes.map((note, index) => (
              <div key={index} className="relative">
                <NoteCard 
                  message={note.message} 
                  index={index} 
                  align={note.align} 
                />
                {note.graphic && (
                  <div className={`absolute top-1/2 -translate-y-1/2 hidden md:block ${note.align === 'left' ? 'right-[10%] md:right-[20%]' : note.align === 'right' ? 'left-[10%] md:left-[20%]' : 'right-[10%]'}`}>
                    {note.graphic}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Make A Wish Finale */}
          <div className="w-full min-h-[70vh] flex flex-col items-center justify-center pb-16">
             <div className="relative flex flex-col items-center">
               <FloatingElement yOffset={10}>
                 <span 
                   className="text-8xl md:text-9xl drop-shadow-2xl mb-8 block transition-transform hover:scale-110 cursor-pointer active:scale-95" 
                   role="img" 
                   aria-label="Birthday Cake" 
                   onClick={handleMakeWish}
                 >
                   {wished ? "🎂" : "🕯️"}
                 </span>
               </FloatingElement>
               <h2 className={`font-serif text-4xl md:text-5xl text-shimmer font-bold transition-all duration-1000 ${wished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                 Happy Birthday!
               </h2>
               <p className={`font-sans text-lg text-foreground/70 mt-4 text-center px-4 transition-all duration-1000 delay-500 ${wished ? 'opacity-100' : 'opacity-0'}`}>
                 May all your wishes come true. Have a magical day! ✨
               </p>
               {!wished && (
                 <p className="font-serif text-xl text-foreground/60 italic mt-8 animate-pulse text-center">
                   Tap the candle to make a wish...
                 </p>
               )}
             </div>
          </div>
          
          {/* Personalized Sign-Off Footer */}
          <div className={`w-full py-16 flex flex-col items-center transition-all duration-[2000ms] ${wished ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-16 h-[1px] bg-foreground/20 mb-8" />
            <p className="font-serif text-2xl md:text-3xl text-foreground/60 italic text-center px-8 leading-relaxed">
              Grateful for your awesome friendship,<br />wishing you the best!
            </p>
            <span className="text-4xl mt-4 animate-pulse">✨</span>
            <p className="mt-8 text-sm text-foreground/30 font-sans tracking-widest uppercase">
              Happy Birthday Priya
            </p>
          </div>
        </div>
      )}

      {/* Floating Cat buddy */}
      {showNotes && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <InteractiveCat />
        </div>
      )}
    </main>
  );
}
