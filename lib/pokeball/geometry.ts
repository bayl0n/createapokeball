import { BufferGeometry, Float32BufferAttribute } from "three";
import {
  bandHalfHeight,
  bandSurfaceRadius,
  patternSegments,
  patternSurfaceRadius,
} from "./dimensions";

export function createBandStripGeometry(
  startAngle: number,
  endAngle: number,
  segments: number,
) {
  const geometry = new BufferGeometry();
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const angle = startAngle + (endAngle - startAngle) * progress;

    for (const y of [bandHalfHeight, -bandHalfHeight]) {
      const radiusAtHeight = Math.sqrt(
        Math.max(0, bandSurfaceRadius ** 2 - y ** 2),
      );
      const x = Math.sin(angle) * radiusAtHeight;
      const z = Math.cos(angle) * radiusAtHeight;
      const normalLength = Math.hypot(x, y, z) || 1;

      vertices.push(x, y, z);
      normals.push(x / normalLength, y / normalLength, z / normalLength);
    }
  }

  for (let index = 0; index < segments; index += 1) {
    const upperCurrent = index * 2;
    const lowerCurrent = upperCurrent + 1;
    const upperNext = upperCurrent + 2;
    const lowerNext = upperCurrent + 3;

    indices.push(upperCurrent, lowerCurrent, upperNext);
    indices.push(lowerCurrent, lowerNext, upperNext);
  }

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  return geometry;
}

export function createSurfacePatchGeometry({
  thetaStart,
  thetaEnd,
  phiStart,
  phiEnd,
  thetaSegments = patternSegments,
  phiSegments = patternSegments,
  radius = patternSurfaceRadius,
}: {
  thetaStart: number;
  thetaEnd: number;
  phiStart: number;
  phiEnd: number;
  thetaSegments?: number;
  phiSegments?: number;
  radius?: number;
}) {
  const geometry = new BufferGeometry();
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let thetaIndex = 0; thetaIndex <= thetaSegments; thetaIndex += 1) {
    const thetaProgress = thetaIndex / thetaSegments;
    const theta = thetaStart + (thetaEnd - thetaStart) * thetaProgress;

    for (let phiIndex = 0; phiIndex <= phiSegments; phiIndex += 1) {
      const phiProgress = phiIndex / phiSegments;
      const phi = phiStart + (phiEnd - phiStart) * phiProgress;
      const sinTheta = Math.sin(theta);
      const x = sinTheta * Math.sin(phi) * radius;
      const y = Math.cos(theta) * radius;
      const z = sinTheta * Math.cos(phi) * radius;
      const normalLength = Math.hypot(x, y, z) || 1;

      vertices.push(x, y, z);
      normals.push(x / normalLength, y / normalLength, z / normalLength);
    }
  }

  const rowSize = phiSegments + 1;

  for (let thetaIndex = 0; thetaIndex < thetaSegments; thetaIndex += 1) {
    for (let phiIndex = 0; phiIndex < phiSegments; phiIndex += 1) {
      const upperCurrent = thetaIndex * rowSize + phiIndex;
      const upperNext = upperCurrent + 1;
      const lowerCurrent = upperCurrent + rowSize;
      const lowerNext = lowerCurrent + 1;

      indices.push(upperCurrent, lowerCurrent, upperNext);
      indices.push(upperNext, lowerCurrent, lowerNext);
    }
  }

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  return geometry;
}
