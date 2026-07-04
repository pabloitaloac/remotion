import appleDeviceModelsData from "./appleDeviceModels.json";

export type AppleDeviceCategory = "phone" | "tablet" | "laptop";

export type AppleDeviceModel = {
  id: string;
  name: string;
  category: AppleDeviceCategory;
  assetPath: string;
  sketchfab: {
    uid: string;
    url: string;
    creator: string;
    license: string;
    licenseUrl: string;
    requirements: string;
    faceCount: number;
    vertexCount: number;
  };
};

export type AppleDeviceId =
  | "iphone-17-pro-max"
  | "macbook-pro-m3-16-2024"
  | "ipad-pro-13-m4-silver";

export const APPLE_DEVICE_MODELS = appleDeviceModelsData as AppleDeviceModel[];

export const getAppleDeviceModel = (id: AppleDeviceId): AppleDeviceModel => {
  const model = APPLE_DEVICE_MODELS.find((entry) => entry.id === id);

  if (!model) {
    throw new Error(`Unknown Apple device model: ${id}`);
  }

  return model;
};
