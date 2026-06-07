"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";
import type { WebGLRenderer } from "three";
import type { PokeballConfig } from "../../../lib/pokeball/config";
import { Pokeball } from "./Pokeball";

export function Scene({
  config,
  isMobile,
  onRendererReady,
}: {
  config: PokeballConfig;
  isMobile: boolean;
  onRendererReady: (renderer: WebGLRenderer) => void;
}) {
  const lightColor =
    config.lighting === "sunset"
      ? "#ffd1a1"
      : config.lighting === "night"
        ? "#b5c7ff"
        : "#ffffff";
  const ambient = config.lighting === "night" ? 0.42 : 0.72;
  const keyIntensity =
    config.lighting === "sunset"
      ? 4.6
      : config.lighting === "night"
        ? 2.8
        : 3.8;
  const cameraPosition: [number, number, number] = isMobile
    ? [0, 0.45, 7.1]
    : [0, 0.55, 6.2];
  const cameraFov = isMobile ? 40 : 38;
  const minDistance = isMobile ? 5.4 : 4;

  return (
    <Canvas
      shadows
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => onRendererReady(gl)}
    >
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />
      <ambientLight intensity={ambient} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={keyIntensity}
        color={lightColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight
        position={[-4, -2, -3]}
        intensity={config.lighting === "night" ? 3.2 : 1.4}
        color="#70e1ff"
      />
      <Suspense fallback={null}>
        <Environment
          preset={
            config.lighting === "sunset"
              ? "sunset"
              : config.lighting === "night"
                ? "night"
                : "city"
          }
        />
        <Pokeball config={config} />
        <ContactShadows
          position={[0, -2.22, 0]}
          opacity={0.34}
          blur={2.8}
          scale={7}
        />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={minDistance}
        maxDistance={20}
        autoRotate={false}
      />
    </Canvas>
  );
}
