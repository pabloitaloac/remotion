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
  DataFlowLine,
  DeviceScreenContent3D,
  SaaSCard3D,
  StudioStage,
  SuccessBadge3D,
  TapRipple3D,
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
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  accent: string;
};

type CarouselDeviceProps = {
  frame: number;
  phase: number;
  deviceId: AppleDeviceId;
  fitTo: number;
  baseY: number;
  home: [number, number, number];
  orbit: [number, number, number];
  yawBase?: number;
  baseScale?: number;
  modelRotation?: [number, number, number];
  screen: ScreenPlacement;
  delay: number;
};

const carouselPose = (
  frame: number,
  phase: number,
  home: [number, number, number],
  orbit: [number, number, number],
  yawBase = 0,
) => {
  const spin = ((frame - 40) / SKEDEZ_DEVICE_SHOWCASE_DURATION) * Math.PI * 2;
  const angle = spin + phase;
  const slide = Math.sin(angle);
  const depth = Math.cos(angle);
  const lift = Math.sin(angle * 2) * orbit[1];
  const x = home[0] + slide * orbit[0];
  const y = home[1] + lift;
  const z = home[2] + depth * orbit[2];
  const yaw = yawBase - slide * 0.14;
  const pitch = mix(0.035, -0.02, (depth + 1) / 2);
  const scale = mix(0.96, 1.04, (depth + 1) / 2);

  return {
    position: [x, y, z] as [number, number, number],
    rotation: [pitch, yaw, 0] as [number, number, number],
    scale,
  };
};

const CarouselDevice = ({
  frame,
  phase,
  deviceId,
  fitTo,
  baseY,
  home,
  orbit,
  yawBase,
  baseScale = 1,
  modelRotation = [0, 0, 0],
  screen,
  delay,
}: CarouselDeviceProps) => {
  const pose = carouselPose(frame, phase, home, orbit, yawBase);
  const enter = revealProgress(frame, delay, 46);
  const screenRotation = screen.rotation ?? [0, 0, 0];
  const position: [number, number, number] = [
    pose.position[0],
    pose.position[1] + baseY,
    pose.position[2],
  ];
  const rotation: [number, number, number] = [
    pose.rotation[0],
    pose.rotation[1],
    pose.rotation[2],
  ];

  return (
    <group
      position={position}
      rotation={rotation}
      scale={pose.scale * baseScale * enter}
    >
      <AppleDeviceModel
        deviceId={deviceId}
        fitTo={fitTo}
        rotation={modelRotation}
      />
      <DeviceScreenContent3D
        accent={screen.accent}
        delay={delay + 12}
        frame={frame}
        height={screen.height}
        position={screen.position}
        rotation={[
          screenRotation[0] - rotation[0],
          screenRotation[1] - rotation[1],
          screenRotation[2] - rotation[2],
        ]}
        texturePath={screen.texturePath}
        width={screen.width}
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
  const delay = 104 + index * 16;
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
        ease(frame, [0, 300], [-0.05, 0.04]),
        ease(frame, [0, 300], [0.12, -0.12]),
        0,
      ]}
      scale={0.6}
    >
      <CarouselDevice
        baseY={-0.18}
        delay={0}
        deviceId="macbook-pro-m3-16-2024"
        fitTo={3.46}
        frame={frame}
        home={[0, -0.18, 0.14]}
        modelRotation={[0.14, 0, 0]}
        orbit={[0.18, 0.03, 0.14]}
        phase={Math.PI / 2}
        screen={{
          texturePath: "assets/skedez/dashboard.png",
          width: 1.44,
          height: 0.82,
          position: [0, 0.68, 0.87],
          rotation: [-0.04, 0, 0],
          accent: colors.green,
        }}
      />
      <CarouselDevice
        baseY={0.04}
        baseScale={0.96}
        delay={8}
        deviceId="iphone-17-pro-max"
        fitTo={1.78}
        frame={frame}
        home={[1.72, 0.12, 0.48]}
        modelRotation={[0, Math.PI / 2, 0]}
        orbit={[0.2, 0.035, 0.16]}
        phase={Math.PI / 2 - (Math.PI * 2) / 3}
        yawBase={-0.08}
        screen={{
          texturePath: "assets/skedez/appointments-management.png",
          width: 0.62,
          height: 1.24,
          position: [0, 0.02, 0.1],
          accent: colors.blue,
        }}
      />
      <CarouselDevice
        baseY={0.02}
        baseScale={0.98}
        delay={16}
        deviceId="ipad-pro-13-m4-silver"
        fitTo={1.96}
        frame={frame}
        home={[-1.72, 0.1, 0.46]}
        orbit={[0.2, 0.035, 0.15]}
        phase={Math.PI / 2 + (Math.PI * 2) / 3}
        yawBase={0.08}
        screen={{
          texturePath: "assets/skedez/smart-calendar.png",
          width: 1.04,
          height: 1.38,
          position: [0, 0.04, 0.12],
          accent: colors.green,
        }}
      />
      <DataFlowLine
        color={colors.green}
        control={[0, 0.56, 1.18]}
        frame={frame}
        from={[-1.8, 0.24, 1.08]}
        pulseColor="#ffffff"
        to={[1.8, 0.24, 1.08]}
      />
      <TapRipple3D
        color={colors.blue}
        frame={frame}
        position={[1.52, 0.38, 1.24]}
        rotation={[0.05, -0.36, -0.08]}
        startFrame={116}
      />
      <SuccessBadge3D
        accent={colors.green}
        frame={frame}
        label="Booked"
        position={[0.7, 2.02, 0.82]}
        rotation={[0.04, -0.12, 0.02]}
        startFrame={154}
      />
      <WorkflowCard
        accent={colors.green}
        frame={frame}
        index={0}
        metric="+24%"
        slot={{
          from: [-3.34, 2.18, 0.42],
          target: [-2.5, 2.16, 0.62],
          rotation: [0.08, 0.28, -0.05],
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
          from: [2.72, 2.46, 0.0],
          target: [0.68, 2.48, -0.04],
          rotation: [0.06, -0.26, 0.04],
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
          from: [3.5, 2.08, 0.5],
          target: [2.56, 2.04, 0.62],
          rotation: [0.07, -0.32, 0.02],
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
          from: [-0.28, 3.1, -0.34],
          target: [-0.72, 2.74, -0.2],
          rotation: [0.08, 0.02, -0.02],
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
  const frame = useCurrentFrame() + 40;
  const { width, height } = useVideoConfig();
  const cameraZ = ease(frame, [0, 120], [9.6, 8.4]);
  const cameraY = ease(frame, [0, 300], [1.06, 0.96]);

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
