import { useMemo } from "react";
import { QuadraticBezierCurve3, Vector3 } from "three";
import { pulseLoop } from "./motion";
import { Vector3Tuple } from "./types";

type DataFlowLineProps = {
  frame: number;
  from: Vector3Tuple;
  to: Vector3Tuple;
  control?: Vector3Tuple;
  color?: string;
  pulseColor?: string;
  radius?: number;
  pulseCount?: number;
  durationInFrames?: number;
};

export const DataFlowLine = ({
  frame,
  from,
  to,
  control,
  color = "#15803d",
  pulseColor = "#ffffff",
  radius = 0.012,
  pulseCount = 3,
  durationInFrames = 96,
}: DataFlowLineProps) => {
  const curve = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const midpoint: Vector3Tuple = control ?? [
      (from[0] + to[0]) / 2,
      Math.max(from[1], to[1]) + 0.72,
      (from[2] + to[2]) / 2,
    ];

    return new QuadraticBezierCurve3(start, new Vector3(...midpoint), end);
  }, [control, from, to]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 48, radius, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0.42} />
      </mesh>
      {Array.from({ length: pulseCount }).map((_, index) => {
        const point = curve.getPoint(
          pulseLoop(
            frame,
            durationInFrames,
            (index * durationInFrames) / pulseCount,
          ),
        );

        return (
          <mesh key={index} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[radius * 4.4, 16, 16]} />
            <meshBasicMaterial color={pulseColor} />
          </mesh>
        );
      })}
    </group>
  );
};
