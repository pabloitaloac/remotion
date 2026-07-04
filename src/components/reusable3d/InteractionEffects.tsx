import { useMemo } from "react";
import { DoubleSide } from "three";
import { createBadgeTexture } from "./canvasTextures";
import { popProgress, revealProgress } from "./motion";
import { Vector3Tuple } from "./types";

type TapRipple3DProps = {
  frame: number;
  startFrame: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  color?: string;
  size?: number;
};

type SuccessBadge3DProps = {
  frame: number;
  label?: string;
  startFrame: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  accent?: string;
  dark?: boolean;
};

export const TapRipple3D = ({
  frame,
  startFrame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = "#15803d",
  size = 0.42,
}: TapRipple3DProps) => {
  const progress = revealProgress(frame, startFrame, 30);
  const opacity = Math.max(0, 1 - progress);

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={size + progress * size}
    >
      <torusGeometry args={[0.5, 0.025, 12, 64]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

export const SuccessBadge3D = ({
  frame,
  label = "Done",
  startFrame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  accent = "#15803d",
  dark = false,
}: SuccessBadge3DProps) => {
  const texture = useMemo(
    () => createBadgeTexture({ label, accent, dark }),
    [accent, dark, label],
  );
  const reveal = popProgress(frame, startFrame, 30);

  return (
    <mesh position={position} rotation={rotation} scale={reveal}>
      <planeGeometry args={[0.62, 0.62]} />
      <meshBasicMaterial
        map={texture}
        side={DoubleSide}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
};
