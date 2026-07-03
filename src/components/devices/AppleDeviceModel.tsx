import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { Box3, Mesh, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { staticFile } from "remotion";
import {
  AppleDeviceId,
  getAppleDeviceModel,
} from "../../assets/devices/appleDeviceModels";

type Vector3Tuple = [number, number, number];

type AppleDeviceModelProps = {
  deviceId: AppleDeviceId;
  fitTo?: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
};

const markShadowReceivers = (object: Object3D) => {
  object.traverse((child) => {
    const mesh = child as Mesh;

    if (!mesh.isMesh) {
      return;
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
};

const getFitTransform = (object: Object3D, fitTo: number | undefined) => {
  if (!fitTo) {
    return {
      offset: [0, 0, 0] as Vector3Tuple,
      scale: 1,
    };
  }

  const box = new Box3().setFromObject(object);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const longestSide = Math.max(size.x, size.y, size.z);
  const fitScale = longestSide > 0 ? fitTo / longestSide : 1;

  return {
    offset: [
      -center.x * fitScale,
      -center.y * fitScale,
      -center.z * fitScale,
    ] as Vector3Tuple,
    scale: fitScale,
  };
};

const LoadedDeviceModel = ({
  assetPath,
  fitTo,
}: {
  assetPath: string;
  fitTo?: number;
}) => {
  const gltf = useLoader(GLTFLoader, staticFile(assetPath));

  const { scene, offset, scale } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    markShadowReceivers(clonedScene);
    const transform = getFitTransform(clonedScene, fitTo);

    return {
      scene: clonedScene,
      ...transform,
    };
  }, [fitTo, gltf.scene]);

  return <primitive object={scene} position={offset} scale={scale} />;
};

export const AppleDeviceModel = ({
  deviceId,
  fitTo,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: AppleDeviceModelProps) => {
  const model = getAppleDeviceModel(deviceId);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <LoadedDeviceModel assetPath={model.assetPath} fitTo={fitTo} />
    </group>
  );
};
