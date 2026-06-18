"use client";

import { useEffect, useRef } from "react";

export default function LanternRelease({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || typeof window === "undefined") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lanterns: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; flicker: number }[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resize);
    resize();

    // Spawn initial wave at bottom (fewer on mobile for perf)
    const isMobile = window.innerWidth < 768;
    const lanternCount = isMobile ? 20 : 40;
    for (let i = 0; i < lanternCount; i++) {
        lanterns.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 500,
            vx: (Math.random() - 0.5) * 0.5,
            vy: Math.random() * -1 - 0.5,
            size: Math.random() * 6 + 4,
            alpha: 0,
            flicker: Math.random() * Math.PI * 2
        });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < lanterns.length; i++) {
        const p = lanterns[i];
        
        // Gentle sway (wind effect)
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vx = Math.max(-1, Math.min(1, p.vx));
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Fade in as they rise, fade out at top
        if (p.y < (canvas.height * 0.8) && p.alpha < 0.8) {
            p.alpha += 0.01;
        }
        if (p.y < (canvas.height * 0.2)) {
            p.alpha -= 0.005;
        }

        // Respawn offscreen at bottom
        if (p.y < -50 || p.alpha <= 0) {
            p.y = canvas.height + Math.random() * 100;
            p.x = Math.random() * canvas.width;
            p.alpha = 0;
            p.vy = Math.random() * -1 - 0.5;
        }

        // Flicker effect
        p.flicker += 0.1;
        const currentAlpha = Math.max(0, p.alpha + Math.sin(p.flicker) * 0.2);

        if (currentAlpha > 0) {
          ctx.globalAlpha = currentAlpha;
          
          // Draw lantern
          ctx.beginPath();
          // A warm, glowing orange/yellow
          ctx.fillStyle = `rgb(255, ${200 + Math.sin(p.flicker)*20}, 100)`;
          
          // Slight rectangle shape for the lantern
          ctx.roundRect(p.x - p.size/2, p.y - p.size, p.size, p.size * 1.5, 2);
          ctx.fill();
          
          // Strong glow
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = "#FF8C00";
        }
      }
      
      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [active]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-[40] transition-opacity duration-[3000ms] ${active ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-purple-950/50 to-slate-900/70 backdrop-blur-[3px]" />
        <canvas 
        ref={canvasRef} 
        className="absolute inset-0" 
        style={{ mixBlendMode: 'screen' }}
        />
    </div>
  );
}
