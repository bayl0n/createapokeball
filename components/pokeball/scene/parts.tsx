"use client";

import { Decal } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  DoubleSide,
  LinearFilter,
  SRGBColorSpace,
} from "three";
import {
  materialByFinish,
  type ShellTexturePreset,
  type PokeballConfig,
} from "../../../lib/pokeball/config";
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

type ShellTextureSide = "top" | "bottom";

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  );
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();
}

function drawAccentShellTexture(context: CanvasRenderingContext2D) {
  for (const x of [392, 512, 632]) {
    fillRoundedRect(context, x - 24, 142, 48, 210, 24);
  }
}

function drawUltraShellTexture(context: CanvasRenderingContext2D) {
  const marks = [
    [
      [392, 86],
      [458, 86],
      [432, 284],
      [334, 384],
      [284, 332],
      [370, 250],
    ],
    [
      [632, 86],
      [566, 86],
      [592, 284],
      [690, 384],
      [740, 332],
      [654, 250],
    ],
  ];

  for (const mark of marks) {
    context.beginPath();
    context.moveTo(mark[0][0], mark[0][1]);
    for (const point of mark.slice(1)) {
      context.lineTo(point[0], point[1]);
    }
    context.closePath();
    context.fill();
  }
}

export function createShellTexture({
  shellColor,
  patternColor,
  preset,
  side,
}: {
  shellColor: string;
  patternColor: string;
  preset: ShellTexturePreset;
  side: ShellTextureSide;
}) {
  if (preset === "none" || side !== "top" || typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = shellColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = patternColor;

  if (preset === "accent") {
    drawAccentShellTexture(context);
  }

  if (preset === "ultra") {
    drawUltraShellTexture(context);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function useShellTexture({
  shellColor,
  patternColor,
  preset,
  side,
}: {
  shellColor: string;
  patternColor: string;
  preset: ShellTexturePreset;
  side: ShellTextureSide;
}) {
  const texture = useMemo(
    () => createShellTexture({ shellColor, patternColor, preset, side }),
    [patternColor, preset, shellColor, side],
  );

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  return texture;
}

export function LetteringDecal({ config }: { config: PokeballConfig }) {
  const text = config.letteringText.trim();
  const texture = useMemo(() => {
    if (!text || typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(0, 0, 0, 0.32)";
    context.fillStyle = config.letteringColor;

    const fontSize = 256;

    context.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
    context.lineWidth = 0;
    context.strokeText(text, canvas.width / 2, canvas.height / 2 + 4);
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 4);

    const nextTexture = new CanvasTexture(canvas);
    nextTexture.colorSpace = SRGBColorSpace;
    nextTexture.minFilter = LinearFilter;
    nextTexture.magFilter = LinearFilter;
    nextTexture.wrapS = ClampToEdgeWrapping;
    nextTexture.wrapT = ClampToEdgeWrapping;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [config.letteringColor, text]);

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  if (!texture) return null;

  return (
    <Decal
      map={texture}
      position={[0, 1.5, 1.82]}
      rotation={Math.PI}
      scale={[5, 4, 1]}
    />
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
  if (
    config.pattern === "classic" ||
    config.pattern === "accent" ||
    config.pattern === "ultra"
  ) {
    return null;
  }

  const topPatternThetaMax = Math.acos(topPatternMinY / patternSurfaceRadius);

  if (config.pattern === "stripe") {
    return (
      <>
        <SurfacePatch
          color={config.patternColor}
          thetaStart={0.68}
          thetaEnd={0.75}
          phiStart={-2.42}
          phiEnd={2.42}
          thetaSegments={4}
          phiSegments={44}
        />
        <SurfacePatch
          color={config.patternColor}
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
          color={config.patternColor}
          thetaStart={0.46}
          thetaEnd={topPatternThetaMax}
          phiStart={0.74}
          phiEnd={2.34}
          thetaSegments={18}
          phiSegments={20}
        />
        <SurfacePatch
          color={config.patternColor}
          thetaStart={0.46}
          thetaEnd={topPatternThetaMax}
          phiStart={-2.34}
          phiEnd={-0.74}
          thetaSegments={18}
          phiSegments={20}
        />
        <SurfacePatch
          color={config.patternColor}
          thetaStart={Math.PI - topPatternThetaMax}
          thetaEnd={Math.PI - 0.46}
          phiStart={0.78}
          phiEnd={2.26}
          thetaSegments={18}
          phiSegments={20}
        />
        <SurfacePatch
          color={config.patternColor}
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

  return null;
}

export function getShellMaterial(config: PokeballConfig) {
  return materialByFinish[config.finish];
}
