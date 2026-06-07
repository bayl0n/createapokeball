"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useLayoutEffect, useRef } from "react";
import { Vector3 } from "three";
import type {
  PerspectiveCamera as ThreePerspectiveCamera,
  WebGLRenderer,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { PokeballConfig } from "../../../lib/pokeball/config";
import { shellRadius } from "../../../lib/pokeball/dimensions";
import { Pokeball } from "./Pokeball";

const cameraTarget: [number, number, number] = [0, 0, 0];
const cameraFov = 38;
const cameraYOffset = 0.42;
const framingRadius = shellRadius * 1.16;
const minCameraDistance = 4.6;
const maxCameraDistance = 20;

function CameraRig() {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetRef = useRef(new Vector3(...cameraTarget));
  const viewDirectionRef = useRef(new Vector3(0, cameraYOffset, 1).normalize());
  const { size } = useThree();

  useLayoutEffect(() => {
    const perspectiveCamera = cameraRef.current;
    if (!perspectiveCamera || size.width <= 0 || size.height <= 0) return;

    const target = targetRef.current.set(...cameraTarget);
    const controls = controlsRef.current;
    const viewDirection = viewDirectionRef.current
      .copy(perspectiveCamera.position)
      .sub(controls?.target ?? target);

    if (viewDirection.lengthSq() < 0.0001) {
      viewDirection.set(0, cameraYOffset, 1);
    }

    viewDirection.normalize();

    const aspect = size.width / size.height;
    const verticalFov = (cameraFov * Math.PI) / 180;
    const horizontalFov =
      2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(aspect, 0.1));
    const fitDistance = Math.max(
      framingRadius / Math.sin(verticalFov / 2),
      framingRadius / Math.sin(horizontalFov / 2),
      minCameraDistance,
    );

    perspectiveCamera.fov = cameraFov;
    perspectiveCamera.aspect = aspect;
    perspectiveCamera.position
      .copy(target)
      .addScaledVector(viewDirection, fitDistance);
    perspectiveCamera.lookAt(target);
    perspectiveCamera.updateProjectionMatrix();

    if (controls) {
      controls.target.copy(target);
      controls.minDistance = minCameraDistance;
      controls.maxDistance = maxCameraDistance;
      controls.update();
    }
  }, [size.height, size.width]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, cameraYOffset, 6.8]}
        fov={cameraFov}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        target={cameraTarget}
        minDistance={minCameraDistance}
        maxDistance={maxCameraDistance}
        autoRotate={false}
      />
    </>
  );
}

export function Scene({
  config,
  onRendererReady,
}: {
  config: PokeballConfig;
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
  return (
    <Canvas
      shadows
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => onRendererReady(gl)}
    >
      <CameraRig />
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
    </Canvas>
  );
}
