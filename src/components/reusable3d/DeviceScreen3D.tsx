import { RoundedBox } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { SRGBColorSpace, TextureLoader } from "three";
import { staticFile } from "remotion";
import { revealProgress } from "./motion";
import { Vector3Tuple } from "./types";

type DeviceScreen3DProps = {
  frame: number;
  texturePath: string;
  delay?: number;
  width?: number;
  height?: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
  accent?: string;
};

export const DeviceScreen3D = ({
  frame,
  texturePath,
  delay = 0,
  width = 2.4,
  height = 1.35,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  accent = "#15803d",
}: DeviceScreen3DProps) => {
  const texture = useLoader(TextureLoader, staticFile(texturePath));
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;

  const reveal = revealProgress(frame, delay, 34);
  const resolvedScale = Array.isArray(scale)
    ? ([
        scale[0] * reveal,
        scale[1] * reveal,
        scale[2] * reveal,
      ] as Vector3Tuple)
    : reveal * scale;

  return (
    <group position={position} rotation={rotation} scale={resolvedScale}>
      <RoundedBox args={[width, height, 0.075]} radius={0.09} smoothness={8}>
        <meshStandardMaterial
          color="#111111"
          metalness={0.12}
          roughness={0.28}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.043]}>
        <planeGeometry args={[width * 0.92, height * 0.86]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[-width * 0.43, height * 0.42, 0.048]}>
        <circleGeometry args={[0.035, 24]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
};
