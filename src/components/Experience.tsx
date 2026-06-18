"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { Suspense } from "react";

export default function Experience({ isOpened, onOpen }: { isOpened: boolean; onOpen: () => void }) {
  return (
    <div className="w-full h-[100dvh]" style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene isOpened={isOpened} onOpen={onOpen} />
        </Suspense>
      </Canvas>
    </div>
  );
}
