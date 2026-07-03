import { Easing, interpolate } from "remotion";
import { Vector3Tuple } from "./types";

type Range = [number, number];

export const clampEase = (
  frame: number,
  input: Range,
  output: Range,
  easing = Easing.inOut(Easing.cubic),
) =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const revealProgress = (
  frame: number,
  startFrame: number,
  durationInFrames: number,
) =>
  clampEase(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    Easing.bezier(0.16, 1, 0.3, 1),
  );

export const popProgress = (
  frame: number,
  startFrame: number,
  durationInFrames: number,
) =>
  clampEase(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    Easing.bezier(0.34, 1.56, 0.64, 1),
  );

export const orbitPoint = ({
  angle,
  radiusX,
  radiusZ,
  center = [0, 0, 0],
  y = 0,
}: {
  angle: number;
  radiusX: number;
  radiusZ: number;
  center?: Vector3Tuple;
  y?: number;
}): Vector3Tuple => [
  center[0] + Math.cos(angle) * radiusX,
  center[1] + y,
  center[2] + Math.sin(angle) * radiusZ,
];

export const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

export const mixVector3 = (
  from: Vector3Tuple,
  to: Vector3Tuple,
  progress: number,
): Vector3Tuple => [
  mix(from[0], to[0], progress),
  mix(from[1], to[1], progress),
  mix(from[2], to[2], progress),
];

export const pulseLoop = (
  frame: number,
  durationInFrames: number,
  offset = 0,
) => {
  const raw = (frame + offset) / durationInFrames;
  return raw - Math.floor(raw);
};
