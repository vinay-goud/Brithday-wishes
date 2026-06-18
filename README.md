<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/GSAP-Animation-88CE02?logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
  <br />
  <h1>✨ Happy Birthday Website Template ✨</h1>
  <p><strong>A magical, interactive, 3D web experience to gift to a special friend.</strong></p>
  <p>Built as a "creative-developer" style digital birthday card, focusing on mobile-first perfection, zero-dependency audio, and delightful micro-interactions.</p>
</div>

---

## 🌟 Overview

Why send a paper card when you can send a breathtaking digital experience? This repository is a production-ready template for a cinematic birthday website. It features a 3D interactive gift box, a custom Web Audio synthesizer for immediate music playback, scroll-storytelling, and advanced Canvas-based particle effects.

Perfect for impressing a female friend, partner, or anyone who appreciates elegant, cute, and magical aesthetics.

## ✨ Features

- 🎁 **Interactive 3D Gift Box**: Built with React Three Fiber. Follows device tilt (Magic Window) and opens on tap.
- 🎵 **Zero-Dependency Synth Engine**: No audio files to download! The "Happy Birthday" melody and sound effects are generated instantly via the Web Audio API.
- 🧚‍♀️ **Fairy Dust Cursor**: A custom Canvas particle system that trails the user's finger/mouse.
- 📱 **Mobile-First Gestures**:
  - **Shake-to-Confetti**: Physically shake the phone to trigger confetti bursts (using DeviceMotion API).
  - **Long-Press Balloons**: Hold anywhere to release floating balloons.
  - **Double-Tap Hearts**: Instagram-style double tap to pop hearts.
- 🐈 **Interactive Purring Cat**: A cute graphic that purrs and emits hearts when petted.
- 📜 **Scrollytelling Notes**: Frosted glassmorphism cards that animate in based on scroll velocity (GSAP + Lenis).
- 🕯️ **Lantern Release Finale**: Tap the candle to make a wish and watch dozens of warm paper lanterns float into a twilight sky.
- 📳 **Haptic Feedback**: Subtle physical vibrations mapped to key interactions (supported devices only).
- 🌈 **Ambient Magic**: Shifting pastel gradient backgrounds and drifting firefly particles.

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/happy-birthday-website-template.git
   cd happy-birthday-website-template
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(Note: ensure you are using a modern version of Node.js)*

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the magic.

## 🛠️ Customization Guide

Make this template your own! It's designed to be easily personalized.

### 1. The Notes / Messages
Open `src/app/page.tsx` and locate the `notes` array at the top. Modify the text, emojis, and alignment to match your personal message.

### 2. The Recipient's Name
In `src/app/page.tsx` and `src/components/Celebration.tsx`, search for "Beautiful" and replace it with their name!

### 3. Colors & Theme
The entire site is themed using CSS variables. Open `src/app/globals.css` and modify the `:root` variables to change the pastel pink/purple theme to any color palette you desire.

## 📦 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, completely Client-Side for WebGL)
- **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) (@react-three/drei)
- **Animations**: [GSAP](https://gsap.com/) (GreenSock)
- **Smooth Scrolling**: [Lenis](https://lenis.studiofreight.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Particles**: `canvas-confetti` and custom HTML5 Canvas implementations
- **Audio**: Custom Web Audio API Synthesizer

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! If you've added an amazing new mobile gesture or a beautiful new 3D element, feel free to open a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
<div align="center">
  <i>Created with all my love, just for you.</i>
</div>
