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

  // Dusty Rose palette
  const boxColor = "#df979d";
  const goldColor = "#ffd700";

  useFrame((state) => {
    // Smoothly scale the box on hover
    if (groupRef.current && !isOpened) {
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

      if (elapsedSinceOpen < 2.0) {
        // Phase 1: Anticipation (shaking and squashing, lid stays on)
        if (groupRef.current) {
          groupRef.current.rotation.y += 0.15;
          groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 30) * 0.1;
          
          // Squash and stretch cartoonish effect
          const squash = Math.sin(state.clock.elapsedTime * 40) * 0.06;
          groupRef.current.scale.x = 1.08 + squash;
          groupRef.current.scale.y = 1.08 - squash;
          groupRef.current.scale.z = 1.08 + squash;
        }
      } else {
        // Phase 2: Pop & Release (lid flies off, box base slides down out of view)
        if (groupRef.current) {
          groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -15, 0.02);
          groupRef.current.rotation.y += 0.02; // slow spin as it slides down
          // Smoothly scale back to normal as it falls
          groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.02);
          groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, 1, 0.02);
          groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, 1, 0.02);
        }

        if (lidRef.current) {
          lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, 6, 0.02);
          lidRef.current.position.x = THREE.MathUtils.lerp(lidRef.current.position.x, 5, 0.02);
          lidRef.current.rotation.z = THREE.MathUtils.lerp(lidRef.current.rotation.z, 1.2, 0.02);
          lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, 1.2, 0.02);
        }
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
      {/* Hollow Box Base construction (5 thin panels) */}
      <group>
        {/* Bottom panel */}
        <mesh castShadow receiveShadow position={[0, -1.45, 0]}>
          <boxGeometry args={[2, 0.1, 2]} />
          <meshStandardMaterial color={boxColor} roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Left wall */}
        <mesh castShadow receiveShadow position={[-0.95, -0.5, 0]}>
          <boxGeometry args={[0.1, 1.8, 2]} />
          <meshStandardMaterial color={boxColor} roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Right wall */}
        <mesh castShadow receiveShadow position={[0.95, -0.5, 0]}>
          <boxGeometry args={[0.1, 1.8, 2]} />
          <meshStandardMaterial color={boxColor} roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Front wall */}
        <mesh castShadow receiveShadow position={[0, -0.5, 0.95]}>
          <boxGeometry args={[1.8, 1.8, 0.1]} />
          <meshStandardMaterial color={boxColor} roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Back wall */}
        <mesh castShadow receiveShadow position={[0, -0.5, -0.95]}>
          <boxGeometry args={[1.8, 1.8, 0.1]} />
          <meshStandardMaterial color={boxColor} roughness={0.4} metalness={0.05} />
        </mesh>
      </group>

      {/* Internal surprise: Glowing light inside hollow box */}
      {isOpened && (
        <group position={[0, -0.5, 0]}>
          <pointLight color="#ffd700" intensity={4} distance={6} decay={1.5} />
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {/* Base Ribbons (flat ribbons on the outside) */}
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[2.02, 2.02, 0.4]} />
        <meshStandardMaterial color={goldColor} roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[0.4, 2.02, 2.02]} />
        <meshStandardMaterial color={goldColor} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Box Lid */}
      <group ref={lidRef} position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[2.1, 0.4, 2.1]} />
          <meshStandardMaterial color={boxColor} roughness={0.4} metalness={0.05} />
        </mesh>
        
        {/* Lid Ribbons */}
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[2.12, 0.42, 0.4]} />
          <meshStandardMaterial color={goldColor} roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[0.4, 0.42, 2.12]} />
          <meshStandardMaterial color={goldColor} roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Bow */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color={goldColor} roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color={goldColor} roughness={0.1} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
