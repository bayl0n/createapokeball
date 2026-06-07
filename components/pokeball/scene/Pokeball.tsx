"use client";

import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef, type ReactNode } from "react";
import type { Group } from "three";
import type { PokeballConfig } from "../../../lib/pokeball/config";
import {
  buttonFaceDepth,
  buttonFaceRadius,
  buttonFaceZ,
  buttonHighlightDepth,
  buttonHighlightRadius,
  buttonHighlightZ,
  grooveAngle,
  shellRadius,
} from "../../../lib/pokeball/dimensions";
import {
  ButtonSocket,
  EquatorBand,
  getShellMaterial,
  PatternGeometry,
  ShellCap,
} from "./parts";

function RotatingGroup({
  config,
  children,
}: {
  config: PokeballConfig;
  children: ReactNode;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (config.spin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.32;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export function Pokeball({ config }: { config: PokeballConfig }) {
  const material = getShellMaterial(config);
  const topMaterial = useMemo(
    () => ({ color: config.topColor, ...material }),
    [config.topColor, material],
  );
  const bottomMaterial = useMemo(
    () => ({ color: config.bottomColor, ...material }),
    [config.bottomColor, material],
  );

  return (
    <RotatingGroup config={config}>
      <group rotation={[0.16, -0.42, 0]}>
        <Float speed={1.3} rotationIntensity={0.06} floatIntensity={0.12}>
          <mesh castShadow receiveShadow>
            <sphereGeometry
              args={[
                shellRadius,
                96,
                48,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2 - grooveAngle,
              ]}
            />
            <meshStandardMaterial {...topMaterial} />
          </mesh>
          <ShellCap color={config.topColor} side="top" material={material} />
          <mesh castShadow receiveShadow>
            <sphereGeometry
              args={[
                shellRadius,
                96,
                48,
                0,
                Math.PI * 2,
                Math.PI / 2 + grooveAngle,
                Math.PI / 2 - grooveAngle,
              ]}
            />
            <meshStandardMaterial {...bottomMaterial} />
          </mesh>
          <ShellCap
            color={config.bottomColor}
            side="bottom"
            material={material}
          />
          <EquatorBand color={config.bandColor} />
          <ButtonSocket color={config.bandColor} />
          <mesh
            position={[0, 0, buttonFaceZ]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry
              args={[buttonFaceRadius, buttonFaceRadius, buttonFaceDepth, 64]}
            />
            <meshStandardMaterial
              color={config.buttonColor}
              roughness={0.2}
              metalness={0.05}
            />
          </mesh>
          <mesh
            position={[0, 0, buttonHighlightZ]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry
              args={[
                buttonHighlightRadius,
                buttonHighlightRadius,
                buttonHighlightDepth,
                64,
              ]}
            />
            <meshStandardMaterial
              color={config.buttonHighlightColor}
              roughness={0.16}
              metalness={0.02}
            />
          </mesh>
          <PatternGeometry config={config} />
        </Float>
      </group>
    </RotatingGroup>
  );
}
