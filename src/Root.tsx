import "./index.css";
import { Composition } from "remotion";
import { defaultProject } from "./templates/ProjectShowcase/defaultProject";
import { ProjectShowcase } from "./templates/ProjectShowcase/ProjectShowcase";

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
    </>
  );
};
