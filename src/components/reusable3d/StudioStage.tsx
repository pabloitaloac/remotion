import { MeshStandardMaterialParameters } from "three";

type StudioStageProps = {
  floorColor?: string;
  gridColor?: string;
  sectionColor?: string;
  floorSize?: number;
  floorY?: number;
  showFloor?: boolean;
  showGrid?: boolean;
  material?: MeshStandardMaterialParameters;
};

export const StudioStage = ({
  floorColor = "#f6f6f6",
  gridColor = "#eeeeee",
  sectionColor = "#e0e0e0",
  floorSize = 9,
  floorY = -1.12,
  showFloor = true,
  showGrid = true,
  material,
}: StudioStageProps) => (
  <>
    <ambientLight intensity={1.25} />
    <directionalLight
      castShadow
      intensity={2.2}
      position={[-2, 5, 4]}
      shadow-mapSize-height={2048}
      shadow-mapSize-width={2048}
    />
    <pointLight color="#ffffff" intensity={28} position={[2.8, 2.4, 2.2]} />
    {showFloor ? (
      <mesh
        receiveShadow
        position={[0, floorY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[floorSize, floorSize, 24, 24]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.62}
          {...material}
        />
      </mesh>
    ) : null}
    {showFloor && showGrid ? (
      <gridHelper
        args={[floorSize, 18, sectionColor, gridColor]}
        position={[0, floorY + 0.005, 0]}
      />
    ) : null}
  </>
);
