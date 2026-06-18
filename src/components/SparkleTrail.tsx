"use client";

import { useEffect, useRef } from "react";

export default function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; color: string; vx: number; vy: number; life: number }[] = [];
    const colors = ["#FFB6C1", "#FFD700", "#FFFFFF", "#FF69B4", "#FFFACD"];
    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 60 : 150;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resize);
    resize();

    const mouse = { x: -100, y: -100 };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouse.x = clientX;
      mouse.y = clientY;
      
      if (particles.length >= maxParticles) return;
      
      const spawnCount = isMobile ? 1 : (Math.random() > 0.5 ? 2 : 3);
      for (let i = 0; i < spawnCount; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 20,
          y: mouse.y + (Math.random() - 0.5) * 20,
          size: Math.random() * 2.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          life: 1
        });
      }
    };

    const onClick = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: clientX,
          y: clientY,
          size: Math.random() * 4 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 8, 
          vy: (Math.random() - 0.5) * 8, 
          life: 1.5 
        });
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("pointerdown", onClick);
    window.addEventListener("touchstart", onClick, { passive: true });

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // Gentle gravity
        p.life -= 0.015; // Fade out speed

        if (p.life > 0) {
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
        }
      }
      
      // Reset shadow for performance
      ctx.shadowBlur = 0;
      
      // Filter dead particles
      particles = particles.filter(p => p.life > 0);
      
      animationId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("touchstart", onClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
