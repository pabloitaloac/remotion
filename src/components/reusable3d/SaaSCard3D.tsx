import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { DoubleSide } from "three";
import { createSaaSCardTexture } from "./canvasTextures";
import { popProgress } from "./motion";
import { Vector3Tuple } from "./types";

type SaaSCard3DProps = {
  frame: number;
  title: string;
  subtitle: string;
  metric?: string;
  accent?: string;
  dark?: boolean;
  delay?: number;
  width?: number;
  height?: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
};

export const SaaSCard3D = ({
  frame,
  title,
  subtitle,
  metric,
  accent = "#15803d",
  dark = false,
  delay = 0,
  width = 1.8,
  height = 0.96,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: SaaSCard3DProps) => {
  const texture = useMemo(
    () => createSaaSCardTexture({ title, subtitle, metric, accent, dark }),
    [accent, dark, metric, subtitle, title],
  );
  const reveal = popProgress(frame, delay, 28);
  const resolvedScale = Array.isArray(scale)
    ? ([
        scale[0] * reveal,
        scale[1] * reveal,
        scale[2] * reveal,
      ] as Vector3Tuple)
    : reveal * scale;

  return (
    <group position={position} rotation={rotation} scale={resolvedScale}>
      <RoundedBox args={[width, height, 0.055]} radius={0.085} smoothness={8}>
        <meshStandardMaterial
          color={dark ? "#111111" : "#ffffff"}
          metalness={0.08}
          roughness={0.38}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[width * 0.97, height * 0.94]} />
        <meshBasicMaterial
          map={texture}
          side={DoubleSide}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
