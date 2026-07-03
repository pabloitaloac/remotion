import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AppleDeviceModel } from "../../components/devices";
import type { AppleDeviceId } from "../../assets/devices/appleDeviceModels";
import {
  SaaSCard3D,
  StudioStage,
  clampEase,
  mix,
  mixVector3,
  revealProgress,
} from "../../components/reusable3d";

export const SKEDEZ_DEVICE_SHOWCASE_DURATION = 300;

const colors = {
  black: "#111111",
  ink: "#171717",
  panel: "#f4f4f4",
  line: "#e0e0e0",
  muted: "#737373",
  green: "#15803d",
  blue: "#2454e6",
  white: "#ffffff",
};

const ease = clampEase;

type WorkflowCardSlot = {
  target: [number, number, number];
  from: [number, number, number];
  rotation: [number, number, number];
};

type ScreenPlacement = {
  texturePath: string;
};

type PresentedDeviceProps = {
  frame: number;
  deviceId: AppleDeviceId;
  fitTo: number;
  from: [number, number, number];
  target: [number, number, number];
  finalRotation: [number, number, number];
  startFrame: number;
  durationInFrames: number;
  baseScale?: number;
  modelRotation?: [number, number, number];
  screen: ScreenPlacement;
  spinTurns?: number;
};

const PresentedDevice = ({
  frame,
  deviceId,
  fitTo,
  from,
  target,
  finalRotation,
  startFrame,
  durationInFrames,
  baseScale = 1,
  modelRotation = [0, 0, 0],
  screen,
  spinTurns = 1,
}: PresentedDeviceProps) => {
  const enter = revealProgress(frame, startFrame, durationInFrames);
  const position = mixVector3(from, target, enter);
  const lift = Math.sin(enter * Math.PI) * 0.34;
  const spin = (1 - enter) * spinTurns * Math.PI * 2;
  const rotation: [number, number, number] = [
    finalRotation[0] + (1 - enter) * 0.22,
    finalRotation[1] + spin,
    finalRotation[2] + (1 - enter) * 0.18,
  ];
  const idleFloat =
    frame > startFrame + durationInFrames
      ? Math.sin((frame - startFrame) / 42) * 0.025
      : 0;
  const scale = baseScale * mix(0.72, 1, enter);

  return (
    <group
      position={[position[0], position[1] + lift + idleFloat, position[2]]}
      rotation={rotation}
      scale={scale}
    >
      <AppleDeviceModel
        deviceId={deviceId}
        fitTo={fitTo}
        rotation={modelRotation}
        screenTexturePath={screen.texturePath}
      />
    </group>
  );
};

const WorkflowCard = ({
  frame,
  index,
  title,
  subtitle,
  accent,
  dark,
  metric,
  slot,
}: {
  frame: number;
  index: number;
  title: string;
  subtitle: string;
  accent: string;
  dark?: boolean;
  metric?: string;
  slot: WorkflowCardSlot;
}) => {
  const delay = 176 + index * 12;
  const enter = revealProgress(frame, delay, 42);
  const position = mixVector3(slot.from, slot.target, enter);
  const holdFloat = Math.sin((frame + index * 18) / 34) * 0.045 * enter;

  return (
    <SaaSCard3D
      accent={accent}
      dark={dark}
      delay={delay}
      frame={frame}
      height={0.78}
      metric={metric}
      position={[position[0], position[1] + holdFloat, position[2]]}
      rotation={slot.rotation}
      subtitle={subtitle}
      title={title}
      width={1.34}
    />
  );
};

const Stage = ({ frame }: { frame: number }) => (
  <>
    <StudioStage />

    <group
      position={[0, 0.18, 0]}
      rotation={[
        ease(frame, [0, 300], [-0.03, 0.025]),
        ease(frame, [0, 300], [0.04, -0.04]),
        0,
      ]}
      scale={0.56}
    >
      <PresentedDevice
        baseScale={0.98}
        deviceId="ipad-pro-13-m4-silver"
        durationInFrames={64}
        finalRotation={[0.01, 0.03, -0.04]}
        fitTo={1.62}
        frame={frame}
        modelRotation={[0, -Math.PI / 2, 0]}
        from={[-4.35, 0.82, 0.62]}
        spinTurns={1.2}
        startFrame={6}
        target={[-2.58, 0.1, 0.52]}
        screen={{
          texturePath: "assets/skedez/smart-calendar.png",
        }}
      />
      <PresentedDevice
        baseScale={0.96}
        deviceId="iphone-17-pro-max"
        durationInFrames={64}
        finalRotation={[0.02, -0.08, 0.06]}
        fitTo={1.58}
        frame={frame}
        modelRotation={[0, Math.PI / 2, 0]}
        from={[5.55, 0.92, 0.62]}
        spinTurns={1.35}
        startFrame={54}
        target={[2.58, 0.14, 0.56]}
        screen={{
          texturePath: "assets/skedez/appointments-management.png",
        }}
      />
      <PresentedDevice
        baseScale={1}
        deviceId="macbook-pro-m3-16-2024"
        durationInFrames={74}
        finalRotation={[0.01, 0, 0]}
        fitTo={3.16}
        frame={frame}
        from={[0, -3.15, -1.45]}
        modelRotation={[0.14, 0, 0]}
        spinTurns={0.82}
        startFrame={106}
        target={[0, -0.34, 0.16]}
        screen={{
          texturePath: "assets/skedez/dashboard.png",
        }}
      />
      <WorkflowCard
        accent={colors.green}
        frame={frame}
        index={0}
        metric="+24%"
        slot={{
          from: [-3.45, 2.84, 0.82],
          target: [-2.54, 2.7, 1],
          rotation: [0.06, 0.2, -0.05],
        }}
        subtitle="24/7 online scheduling"
        title="Bookings"
      />
      <WorkflowCard
        accent={colors.black}
        dark
        frame={frame}
        index={1}
        slot={{
          from: [0, 3.36, 0.74],
          target: [0, 2.96, 0.84],
          rotation: [0.05, 0, 0.03],
        }}
        subtitle="Email + WhatsApp"
        title="Reminders"
      />
      <WorkflowCard
        accent={colors.blue}
        frame={frame}
        index={2}
        metric="12 synced"
        slot={{
          from: [3.45, 2.84, 0.82],
          target: [2.54, 2.7, 1],
          rotation: [0.06, -0.2, 0.05],
        }}
        subtitle="Google Calendar sync"
        title="Calendar"
      />
      <WorkflowCard
        accent={colors.green}
        frame={frame}
        index={3}
        metric="-31%"
        slot={{
          from: [0, -2.52, 1.58],
          target: [0, -2.12, 1.68],
          rotation: [-0.08, 0, 0],
        }}
        subtitle="No-shows and revenue"
        title="Analytics"
      />
    </group>
  </>
);

const BrandOverlay = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 58,
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      <Img
        src={staticFile("assets/skedez/icon.png")}
        style={{ height: 42, width: 42 }}
      />
      <div
        style={{
          color: colors.black,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 38,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        SkedEz
      </div>
    </div>
  </AbsoluteFill>
);

export const SkedEzDeviceShowcase = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cameraZ = ease(frame, [0, 170], [9.8, 8.35]);
  const cameraY = ease(frame, [0, 300], [1.08, 0.96]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 60% 28%, #ffffff 0%, #f7f7f7 46%, #ececec 100%)",
        overflow: "hidden",
      }}
    >
      <ThreeCanvas
        camera={{
          fov: 42,
          position: [0, cameraY, cameraZ],
        }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
        }}
        height={height}
        shadows
        width={width}
      >
        <Stage frame={frame} />
      </ThreeCanvas>
      <BrandOverlay />
    </AbsoluteFill>
  );
};
