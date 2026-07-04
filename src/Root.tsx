import "./index.css";
import { Composition } from "remotion";
import { defaultProject } from "./templates/ProjectShowcase/defaultProject";
import { ProjectShowcase } from "./templates/ProjectShowcase/ProjectShowcase";
import {
  SKEDEZ_DEVICE_SHOWCASE_DURATION,
  SkedEzDeviceShowcase,
} from "./templates/SkedEzDeviceShowcase";
import {
  REUSABLE_3D_KIT_SHOWCASE_DURATION,
  Reusable3DKitShowcase,
} from "./templates/Reusable3DKitShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProjectShowcase"
        component={ProjectShowcase}
        defaultProps={defaultProject}
        durationInFrames={285}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="SkedEzDeviceShowcase"
        component={SkedEzDeviceShowcase}
        durationInFrames={SKEDEZ_DEVICE_SHOWCASE_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reusable3DKitShowcase"
        component={Reusable3DKitShowcase}
        durationInFrames={REUSABLE_3D_KIT_SHOWCASE_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
    </>
  );
};
