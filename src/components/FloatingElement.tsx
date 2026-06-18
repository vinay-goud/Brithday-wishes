"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FloatingElement({ 
  children, 
  delay = 0, 
  yOffset = 20,
  duration = 2
}: { 
  children: React.ReactNode, 
  delay?: number, 
  yOffset?: number,
  duration?: number
}) {
  const elRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (elRef.current) {
      const ctx = gsap.context(() => {
        gsap.to(elRef.current, {
          y: yOffset,
          duration: duration,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: delay
        });
      });
      return () => ctx.revert();
    }
  }, [delay, yOffset, duration]);
  
  return <div ref={elRef} className="inline-block relative z-10">{children}</div>;
}
