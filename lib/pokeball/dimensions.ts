export const shellRadius = 2;
export const grooveAngle = 0.08;
export const bandSurfaceRadius = shellRadius - 0.035;
export const bandHalfHeight = 0.16;
export const buttonBackingRadius = 0.6;
export const buttonBackingDepth = 0.11;
export const buttonFaceRadius = 0.4;
export const buttonFaceDepth = 0.08;
export const buttonHighlightRadius = 0.22;
export const buttonHighlightDepth = 0.035;
export const buttonBackingShellZ =
  Math.sqrt(Math.max(0, shellRadius ** 2 - buttonBackingRadius ** 2)) - 0.05;
export const buttonBackingFrontZ =
  buttonBackingShellZ + buttonBackingDepth - 0.006;
export const buttonBackingZ = buttonBackingFrontZ - buttonBackingDepth / 2;
export const buttonFaceZ = buttonBackingFrontZ + buttonFaceDepth / 2 - 0.004;
export const buttonHighlightZ = buttonFaceZ + buttonFaceDepth / 2;
export const patternSurfaceRadius = shellRadius + 0.012;
export const patternSegments = 28;
export const topPatternMinY = bandHalfHeight + 0.08;
export const topCapY = Math.cos(Math.PI / 2 - grooveAngle) * shellRadius;
export const bottomCapY = Math.cos(Math.PI / 2 + grooveAngle) * shellRadius;
export const shellCapRadius =
  Math.sin(Math.PI / 2 - grooveAngle) * shellRadius;
export const shellCapBias = 0.002;
