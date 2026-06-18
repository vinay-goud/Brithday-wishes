"use client";

import { Environment, Float } from "@react-three/drei";
import GiftBox from "./GiftBox";

export default function Scene({ isOpened, onOpen }: { isOpened: boolean; onOpen: () => void }) {
  return (
    <>
      <color attach="background" args={["#ffe4e1"]} />
      
      {/* Lighting for an elegant pastel look */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      {/* Soft environment lighting */}
      <Environment preset="city" />

      {/* The Gift Box */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <GiftBox isOpened={isOpened} onClick={onOpen} />
      </Float>
    </>
  );
}
