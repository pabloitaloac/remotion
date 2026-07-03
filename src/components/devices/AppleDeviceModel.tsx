import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import {
  Box3,
  ClampToEdgeWrapping,
  Color,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { staticFile } from "remotion";
import {
  AppleDeviceId,
  getAppleDeviceModel,
} from "../../assets/devices/appleDeviceModels";

type Vector3Tuple = [number, number, number];

type AppleDeviceModelProps = {
  deviceId: AppleDeviceId;
  finish?: AppleDeviceFinish;
  fitTo?: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
  screenTexturePath?: string;
};

type ScreenMaterialConfig = {
  materialNames: string[];
  repeat?: [number, number];
  offset?: [number, number];
  clamp?: boolean;
};

export type AppleDeviceFinishMaterialOverride = {
  materialNames: string[];
  color: string;
  metalness?: number;
  roughness?: number;
};

export type AppleDeviceFinish =
  | "default"
  | "cosmic-orange"
  | "deep-blue"
  | "silver";

export const IPHONE_17_PRO_MAX_FINISHES: Record<
  Exclude<AppleDeviceFinish, "default">,
  AppleDeviceFinishMaterialOverride[]
> = {
  "cosmic-orange": [
    {
      materialNames: ["basecolor.001", "backpanel.001", "Material.005"],
      color: "#d45b24",
      metalness: 0.76,
      roughness: 0.5,
    },
    {
      materialNames: ["metalframe.002", "Material.006"],
      color: "#8f330f",
      metalness: 0.78,
      roughness: 0.46,
    },
  ],
  "deep-blue": [
    {
      materialNames: ["basecolor.001", "backpanel.001", "Material.005"],
      color: "#1c3768",
      metalness: 0.74,
      roughness: 0.5,
    },
    {
      materialNames: ["metalframe.002", "Material.006"],
      color: "#0d1d3d",
      metalness: 0.8,
      roughness: 0.44,
    },
  ],
  silver: [
    {
      materialNames: ["basecolor.001", "backpanel.001", "Material.005"],
      color: "#d9dbd5",
      metalness: 0.72,
      roughness: 0.48,
    },
    {
      materialNames: ["metalframe.002", "Material.006"],
      color: "#aeb4ae",
      metalness: 0.78,
      roughness: 0.42,
    },
  ],
};

const DEVICE_FINISH_CONFIGS: Partial<
  Record<AppleDeviceId, Record<string, AppleDeviceFinishMaterialOverride[]>>
> = {
  "iphone-17-pro-max": IPHONE_17_PRO_MAX_FINISHES,
};

const DEVICE_SCREEN_MATERIAL_CONFIGS: Record<
  AppleDeviceId,
  ScreenMaterialConfig
> = {
  "iphone-17-pro-max": {
    materialNames: ["screen.001"],
    repeat: [0.514151, 1],
    offset: [0.489759, -0.001876],
    clamp: true,
  },
  "macbook-pro-m3-16-2024": {
    materialNames: ["sfCQkHOWyrsLmor"],
  },
  "ipad-pro-13-m4-silver": {
    materialNames: ["otqLWQuZkhmipQs"],
  },
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

const configureScreenTexture = (
  texture: Texture,
  screenMaterialConfig: ScreenMaterialConfig,
) => {
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = false;
  texture.wrapS = screenMaterialConfig.clamp
    ? ClampToEdgeWrapping
    : RepeatWrapping;
  texture.wrapT = screenMaterialConfig.clamp
    ? ClampToEdgeWrapping
    : RepeatWrapping;
  texture.anisotropy = 8;

  if (screenMaterialConfig.repeat) {
    texture.repeat.set(
      screenMaterialConfig.repeat[0],
      screenMaterialConfig.repeat[1],
    );
  }

  if (screenMaterialConfig.offset) {
    texture.offset.set(
      screenMaterialConfig.offset[0],
      screenMaterialConfig.offset[1],
    );
  }

  texture.needsUpdate = true;

  return texture;
};

const replaceScreenMaterial = (material: Material, texture: Texture) => {
  const replacement = material.clone();

  if (replacement instanceof MeshStandardMaterial) {
    replacement.map = texture;
    replacement.emissive = new Color("#ffffff");
    replacement.emissiveMap = texture;
    replacement.emissiveIntensity = 0.05;
    replacement.color = new Color("#ffffff");
    replacement.metalness = 0;
    replacement.roughness = 0.38;
    replacement.toneMapped = false;
  }

  replacement.needsUpdate = true;

  return replacement;
};

const replaceScreenMaterials = ({
  object,
  screenMaterialNames,
  texture,
}: {
  object: Object3D;
  screenMaterialNames: string[];
  texture: Texture;
}) => {
  const screenMaterialNameSet = new Set(screenMaterialNames);
  const replacements = new Map<Material, Material>();

  object.traverse((child) => {
    const mesh = child as Mesh;

    if (!mesh.isMesh || !mesh.material) {
      return;
    }

    const resolveMaterial = (material: Material) => {
      if (!screenMaterialNameSet.has(material.name)) {
        return material;
      }

      const cachedReplacement = replacements.get(material);

      if (cachedReplacement) {
        return cachedReplacement;
      }

      const replacement = replaceScreenMaterial(material, texture);
      replacements.set(material, replacement);

      return replacement;
    };

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(resolveMaterial)
      : resolveMaterial(mesh.material);
  });
};

const replaceFinishMaterial = (
  material: Material,
  override: AppleDeviceFinishMaterialOverride,
) => {
  const replacement = material.clone();

  if (replacement instanceof MeshStandardMaterial) {
    replacement.color = new Color(override.color);

    if (override.metalness !== undefined) {
      replacement.metalness = override.metalness;
    }

    if (override.roughness !== undefined) {
      replacement.roughness = override.roughness;
    }
  }

  replacement.needsUpdate = true;

  return replacement;
};

const replaceFinishMaterials = ({
  object,
  materialOverrides,
}: {
  object: Object3D;
  materialOverrides: AppleDeviceFinishMaterialOverride[];
}) => {
  const replacements = new Map<Material, Material>();
  const materialOverrideMap = new Map<
    string,
    AppleDeviceFinishMaterialOverride
  >();

  materialOverrides.forEach((override) => {
    override.materialNames.forEach((materialName) => {
      materialOverrideMap.set(materialName, override);
    });
  });

  object.traverse((child) => {
    const mesh = child as Mesh;

    if (!mesh.isMesh || !mesh.material) {
      return;
    }

    const resolveMaterial = (material: Material) => {
      const override = materialOverrideMap.get(material.name);

      if (!override) {
        return material;
      }

      const cachedReplacement = replacements.get(material);

      if (cachedReplacement) {
        return cachedReplacement;
      }

      const replacement = replaceFinishMaterial(material, override);
      replacements.set(material, replacement);

      return replacement;
    };

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(resolveMaterial)
      : resolveMaterial(mesh.material);
  });
};

const getDeviceFinishConfig = (
  deviceId: AppleDeviceId,
  finish: AppleDeviceFinish | undefined,
) => {
  if (!finish || finish === "default") {
    return undefined;
  }

  return DEVICE_FINISH_CONFIGS[deviceId]?.[finish];
};

const LoadedDeviceModel = ({
  assetPath,
  finishConfig,
  fitTo,
  screenMaterialConfig,
  screenTexture,
}: {
  assetPath: string;
  finishConfig?: AppleDeviceFinishMaterialOverride[];
  fitTo?: number;
  screenMaterialConfig?: ScreenMaterialConfig;
  screenTexture?: Texture;
}) => {
  const gltf = useLoader(GLTFLoader, staticFile(assetPath));

  const { scene, offset, scale } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    markShadowReceivers(clonedScene);

    if (finishConfig) {
      replaceFinishMaterials({
        object: clonedScene,
        materialOverrides: finishConfig,
      });
    }

    if (screenTexture && screenMaterialConfig) {
      replaceScreenMaterials({
        object: clonedScene,
        screenMaterialNames: screenMaterialConfig.materialNames,
        texture: screenTexture,
      });
    }

    const transform = getFitTransform(clonedScene, fitTo);

    return {
      scene: clonedScene,
      ...transform,
    };
  }, [finishConfig, fitTo, gltf.scene, screenMaterialConfig, screenTexture]);

  return <primitive object={scene} position={offset} scale={scale} />;
};

const LoadedDeviceModelWithScreen = ({
  assetPath,
  finishConfig,
  fitTo,
  screenMaterialConfig,
  screenTexturePath,
}: {
  assetPath: string;
  finishConfig?: AppleDeviceFinishMaterialOverride[];
  fitTo?: number;
  screenMaterialConfig: ScreenMaterialConfig;
  screenTexturePath: string;
}) => {
  const loadedScreenTexture = useLoader(
    TextureLoader,
    staticFile(screenTexturePath),
  );
  const screenTexture = useMemo(
    () => configureScreenTexture(loadedScreenTexture, screenMaterialConfig),
    [loadedScreenTexture, screenMaterialConfig],
  );

  return (
    <LoadedDeviceModel
      assetPath={assetPath}
      finishConfig={finishConfig}
      fitTo={fitTo}
      screenMaterialConfig={screenMaterialConfig}
      screenTexture={screenTexture}
    />
  );
};

export const AppleDeviceModel = ({
  deviceId,
  finish,
  fitTo,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  screenTexturePath,
}: AppleDeviceModelProps) => {
  const model = getAppleDeviceModel(deviceId);
  const screenMaterialConfig = DEVICE_SCREEN_MATERIAL_CONFIGS[deviceId];
  const finishConfig = getDeviceFinishConfig(deviceId, finish);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {screenTexturePath ? (
        <LoadedDeviceModelWithScreen
          assetPath={model.assetPath}
          finishConfig={finishConfig}
          fitTo={fitTo}
          screenMaterialConfig={screenMaterialConfig}
          screenTexturePath={screenTexturePath}
        />
      ) : (
        <LoadedDeviceModel
          assetPath={model.assetPath}
          finishConfig={finishConfig}
          fitTo={fitTo}
        />
      )}
    </group>
  );
};
