"use client";

import { useMemo } from "react";
import { DoubleSide } from "three";
import { materialByFinish, type PokeballConfig } from "../../../lib/pokeball/config";
import {
  bottomCapY,
  buttonBackingDepth,
  buttonBackingRadius,
  buttonBackingZ,
  patternSurfaceRadius,
  shellCapBias,
  shellCapRadius,
  topCapY,
  topPatternMinY,
} from "../../../lib/pokeball/dimensions";
import {
  createBandStripGeometry,
  createSurfacePatchGeometry,
} from "../../../lib/pokeball/geometry";

export function EquatorBand({ color }: { color: string }) {
  const geometry = useMemo(
    () => createBandStripGeometry(0, Math.PI * 2, 144),
    [],
  );

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.32} metalness={0.04} />
    </mesh>
  );
}

export function ButtonSocket({ color }: { color: string }) {
  return (
    <mesh
      position={[0, 0, buttonBackingZ]}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <cylinderGeometry
        args={[
          buttonBackingRadius,
          buttonBackingRadius,
          buttonBackingDepth,
          80,
        ]}
      />
      <meshStandardMaterial color={color} roughness={0.36} metalness={0.03} />
    </mesh>
  );
}

export function ShellCap({
  color,
  side,
  material,
}: {
  color: string;
  side: "top" | "bottom";
  material: { roughness: number; metalness: number };
}) {
  const y = side === "top" ? topCapY + shellCapBias : bottomCapY - shellCapBias;

  return (
    <mesh
      position={[0, y, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <circleGeometry args={[shellCapRadius, 96]} />
      <meshStandardMaterial
        color={color}
        roughness={material.roughness}
        metalness={material.metalness}
        side={DoubleSide}
      />
    </mesh>
  );
}

function SurfacePatch({
  color,
  thetaStart,
  thetaEnd,
  phiStart,
  phiEnd,
  thetaSegments,
  phiSegments,
}: {
  color: string;
  thetaStart: number;
  thetaEnd: number;
  phiStart: number;
  phiEnd: number;
  thetaSegments?: number;
  phiSegments?: number;
}) {
  const geometry = useMemo(
    () =>
      createSurfacePatchGeometry({
        thetaStart,
        thetaEnd,
        phiStart,
        phiEnd,
        thetaSegments,
        phiSegments,
      }),
    [thetaStart, thetaEnd, phiStart, phiEnd, thetaSegments, phiSegments],
  );

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.26} metalness={0.04} />
    </mesh>
  );
}

export function PatternGeometry({ config }: { config: PokeballConfig }) {
  if (config.pattern === "classic") return null;

  const topPatternThetaMax = Math.acos(topPatternMinY / patternSurfaceRadius);

  if (config.pattern === "stripe") {
    return (
      <>
        <SurfacePatch
          color={config.buttonColor}
          thetaStart={0.68}
          thetaEnd={0.75}
          phiStart={-2.42}
          phiEnd={2.42}
          thetaSegments={4}
          phiSegments={44}
        />
        <SurfacePatch
          color={config.bandColor}
          thetaStart={0.96}
          thetaEnd={1.04}
          phiStart={-2.34}
          phiEnd={2.34}
          thetaSegments={4}
          phiSegments={44}
        />
      </>
    );
  }

  if (config.pattern === "split") {
    return (
      <>
        <SurfacePatch
          color={config.buttonColor}
          thetaStart={0.46}
          thetaEnd={topPatternThetaMax}
          phiStart={0.74}
          phiEnd={2.34}
          thetaSegments={18}
          phiSegments={20}
        />
        <SurfacePatch
          color={config.buttonColor}
          thetaStart={0.46}
          thetaEnd={topPatternThetaMax}
          phiStart={-2.34}
          phiEnd={-0.74}
          thetaSegments={18}
          phiSegments={20}
        />
        <SurfacePatch
          color={config.topColor}
          thetaStart={Math.PI - topPatternThetaMax}
          thetaEnd={Math.PI - 0.46}
          phiStart={0.78}
          phiEnd={2.26}
          thetaSegments={18}
          phiSegments={20}
        />
        <SurfacePatch
          color={config.topColor}
          thetaStart={Math.PI - topPatternThetaMax}
          thetaEnd={Math.PI - 0.46}
          phiStart={-2.26}
          phiEnd={-0.78}
          thetaSegments={18}
          phiSegments={20}
        />
      </>
    );
  }

  return (
    <>
      {[-0.52, 0, 0.52].map((phi) => (
        <SurfacePatch
          color={config.buttonColor}
          key={phi}
          thetaStart={0.52}
          thetaEnd={0.98}
          phiStart={phi - 0.09}
          phiEnd={phi + 0.09}
          thetaSegments={16}
          phiSegments={4}
        />
      ))}
    </>
  );
}

export function getShellMaterial(config: PokeballConfig) {
  return materialByFinish[config.finish];
}
