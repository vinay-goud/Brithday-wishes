"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GiftBoxProps {
  isOpened: boolean;
  onClick: () => void;
}

export default function GiftBox({ isOpened, onClick }: GiftBoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const openTime = useRef<number | null>(null);

  useFrame((state) => {
    // Smoothly scale the box on hover
    if (groupRef.current) {
      const targetScale = hovered ? 1.08 : 1;
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1);
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.1);
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.1);
    }

    if (groupRef.current && !isOpened) {
      // Gentle floating and self-rotation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }

    if (isOpened) {
      if (openTime.current === null) {
        openTime.current = state.clock.elapsedTime;
      }
      const elapsedSinceOpen = state.clock.elapsedTime - openTime.current;

      if (groupRef.current && elapsedSinceOpen < 1.2) {
        // Smooth fast spin/shake on click before opening
        groupRef.current.rotation.y += 0.12;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 25) * 0.08;
      } else if (groupRef.current) {
        // Slide down out of view completely (y: -15) so it doesn't stay visible in background
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -15, 0.04);
      }

      if (lidRef.current) {
        lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, 4.5, 0.04);
        lidRef.current.position.x = THREE.MathUtils.lerp(lidRef.current.position.x, 3.5, 0.04);
        lidRef.current.rotation.z = THREE.MathUtils.lerp(lidRef.current.rotation.z, 0.8, 0.04);
        lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, 0.8, 0.04);
      }
    }
  });

  const onPointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const onPointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group 
      ref={groupRef} 
      onClick={onClick} 
      onPointerOver={onPointerOver} 
      onPointerOut={onPointerOut}
    >
      {/* Box Base */}
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#e94b7b" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Base Ribbons */}
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[2.02, 2.02, 0.4]} />
        <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[0.4, 2.02, 2.02]} />
        <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Box Lid */}
      <group ref={lidRef} position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[2.1, 0.4, 2.1]} />
          <meshStandardMaterial color="#e94b7b" roughness={0.15} metalness={0.1} />
        </mesh>
        
        {/* Lid Ribbons */}
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[2.12, 0.42, 0.4]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[0.4, 0.42, 2.12]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Bow */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
