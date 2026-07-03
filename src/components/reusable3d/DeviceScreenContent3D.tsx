import { useLoader } from "@react-three/fiber";
import { DoubleSide, SRGBColorSpace, TextureLoader } from "three";
import { staticFile } from "remotion";
import { revealProgress } from "./motion";
import { Vector3Tuple } from "./types";

type DeviceScreenContent3DProps = {
  frame: number;
  texturePath: string;
  delay?: number;
  width: number;
  height: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
  accent?: string;
};

export const DeviceScreenContent3D = ({
  frame,
  texturePath,
  delay = 0,
  width,
  height,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  accent = "#15803d",
}: DeviceScreenContent3DProps) => {
  const texture = useLoader(TextureLoader, staticFile(texturePath));
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;

  const reveal = revealProgress(frame, delay, 30);
  const resolvedScale = Array.isArray(scale)
    ? ([
        scale[0] * reveal,
        scale[1] * reveal,
        scale[2] * reveal,
      ] as Vector3Tuple)
    : reveal * scale;

  return (
    <group position={position} rotation={rotation} scale={resolvedScale}>
      <mesh position={[0, 0, -0.012]} renderOrder={18}>
        <planeGeometry args={[width * 1.08, height * 1.08]} />
        <meshBasicMaterial
          color={accent}
          depthTest={false}
          opacity={0.16}
          side={DoubleSide}
          transparent
        />
      </mesh>
      <mesh position={[0, 0, -0.006]} renderOrder={19}>
        <planeGeometry args={[width * 1.018, height * 1.018]} />
        <meshBasicMaterial
          color="#050505"
          depthTest={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0]} renderOrder={20}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          depthTest={false}
          map={texture}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
