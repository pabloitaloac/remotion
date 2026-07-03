import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { continueRender, delayRender, staticFile } from "remotion";
import {
  AppleDeviceId,
  getAppleDeviceModel,
} from "../../assets/devices/appleDeviceModels";

type Vector3Tuple = [number, number, number];

type AppleDeviceModelProps = {
  deviceId: AppleDeviceId;
  fitTo?: number;
  placeholderSize?: Vector3Tuple;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
};

const useStaticAssetAvailable = (assetPath: string) => {
  const url = staticFile(assetPath);
  const [available, setAvailable] = useState<boolean | null>(null);
  const handle = useRef<number | null>(null);

  if (handle.current === null && available === null) {
    handle.current = delayRender(`Checking device asset ${assetPath}`);
  }

  useEffect(() => {
    let cancelled = false;

    fetch(url, { method: "HEAD" })
      .then((response) => {
        if (!cancelled) {
          setAvailable(response.ok);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailable(false);
        }
      })
      .finally(() => {
        if (handle.current !== null) {
          continueRender(handle.current);
          handle.current = null;
        }
      });

    return () => {
      cancelled = true;

      if (handle.current !== null) {
        continueRender(handle.current);
        handle.current = null;
      }
    };
  }, [url]);

  return available;
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

const MissingDeviceModel = ({
  name,
  size,
}: {
  name: string;
  size: Vector3Tuple;
}) => {
  const edgeMaterial = useMemo(
    () => new MeshBasicMaterial({ color: "#111111", wireframe: true }),
    [],
  );
  const bodyMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#ededed",
        metalness: 0.2,
        opacity: 0.22,
        roughness: 0.6,
        transparent: true,
      }),
    [],
  );
  return (
    <group name={`Missing ${name} model asset`}>
      <mesh material={bodyMaterial}>
        <boxGeometry args={size} />
      </mesh>
      <mesh material={edgeMaterial}>
        <boxGeometry args={size} />
      </mesh>
    </group>
  );
};

export const AppleDeviceModel = ({
  deviceId,
  fitTo,
  placeholderSize = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: AppleDeviceModelProps) => {
  const model = getAppleDeviceModel(deviceId);
  const available = useStaticAssetAvailable(model.assetPath);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {available === true ? (
        <LoadedDeviceModel assetPath={model.assetPath} fitTo={fitTo} />
      ) : (
        <MissingDeviceModel name={model.name} size={placeholderSize} />
      )}
    </group>
  );
};
