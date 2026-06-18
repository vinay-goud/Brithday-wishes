"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { playPop } from "@/utils/audio";

export default function ShakeConfetti() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastShake = 0;
    let lastX = 0, lastY = 0, lastZ = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;

      const totalAccel = deltaX + deltaY + deltaZ;

      if (totalAccel > 25) {
        const now = Date.now();
        if (now - lastShake > 2000) {
          lastShake = now;
          
          // Fire confetti burst!
          confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.5 },
            colors: ["#ffb6c1", "#ffd700", "#ff69b4", "#e6e6fa", "#ffffff"],
            shapes: ["star", "circle"],
          });
          
          playPop();
          
          // Haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }
        }
      }
    };

    // On iOS 13+, we need permission
    const requestPermission = async () => {
      const deviceMotionEvent = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<PermissionState> };
      if (typeof deviceMotionEvent.requestPermission === "function") {
        try {
          const permission = await deviceMotionEvent.requestPermission();
          if (permission === "granted") {
            window.addEventListener("devicemotion", handleMotion);
          }
        } catch {
          // Permission denied, silently fail
        }
      } else {
        window.addEventListener("devicemotion", handleMotion);
      }
    };

    // We request permission on first user interaction
    const onInteraction = () => {
      requestPermission();
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("click", onInteraction);
    };

    window.addEventListener("touchstart", onInteraction, { once: true });
    window.addEventListener("click", onInteraction, { once: true });

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("click", onInteraction);
    };
  }, []);

  return null; // Invisible component
}
