"use client";

import { useEffect, useRef } from "react";

export default function Fireflies() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 12 : 20;

    type Firefly = {
      x: number; y: number; size: number;
      speedX: number; speedY: number;
      alpha: number; phase: number;
    };

    const fireflies: Firefly[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resize);
    resize();

    // Initialize fireflies
    for (let i = 0; i < count; i++) {
      fireflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        alpha: Math.random(),
        phase: Math.random() * Math.PI * 2,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const f of fireflies) {
        // Gentle drift
        f.x += f.speedX;
        f.y += f.speedY;

        // Slight random direction change
        f.speedX += (Math.random() - 0.5) * 0.02;
        f.speedY += (Math.random() - 0.5) * 0.02;
        f.speedX = Math.max(-0.5, Math.min(0.5, f.speedX));
        f.speedY = Math.max(-0.5, Math.min(0.5, f.speedY));

        // Wrap around edges
        if (f.x < -10) f.x = canvas.width + 10;
        if (f.x > canvas.width + 10) f.x = -10;
        if (f.y < -10) f.y = canvas.height + 10;
        if (f.y > canvas.height + 10) f.y = -10;

        // Pulsing glow
        f.phase += 0.02;
        const glow = 0.3 + Math.sin(f.phase) * 0.3;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 120, ${glow})`;
        ctx.fill();

        // Soft glow halo
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(255, 215, 120, ${glow * 0.5})`;
      }
      
      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[5]" 
    />
  );
}
