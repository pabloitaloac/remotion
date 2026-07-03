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

export const pulseLoop = (
  frame: number,
  durationInFrames: number,
  offset = 0,
) => {
  const raw = (frame + offset) / durationInFrames;
  return raw - Math.floor(raw);
};
