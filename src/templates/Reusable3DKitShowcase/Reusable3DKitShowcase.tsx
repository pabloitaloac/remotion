import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AppleDeviceModel } from "../../components/devices";
import type { AppleDeviceId } from "../../assets/devices/appleDeviceModels";
import {
  DataFlowLine,
  SaaSCard3D,
  StudioStage,
  SuccessBadge3D,
  TapRipple3D,
  clampEase,
  mix,
  mixVector3,
  revealProgress,
} from "../../components/reusable3d";

export const REUSABLE_3D_KIT_SHOWCASE_DURATION = 240;

type Slot = {
  from: [number, number, number];
  target: [number, number, number];
  rotation: [number, number, number];
};

type ScreenPlacement = {
  texturePath: string;
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

const AnimatedCardExample = ({
  frame,
  delay,
  slot,
  title,
  subtitle,
  accent,
  metric,
  dark,
}: {
  frame: number;
  delay: number;
  slot: Slot;
  title: string;
  subtitle: string;
  accent: string;
  metric?: string;
  dark?: boolean;
}) => {
  const enter = revealProgress(frame, delay, 42);
  const position = mixVector3(slot.from, slot.target, enter);
  const float = Math.sin((frame + delay) / 36) * 0.04 * enter;

  return (
    <SaaSCard3D
      accent={accent}
      dark={dark}
      delay={delay}
      frame={frame}
      height={0.76}
      metric={metric}
      position={[position[0], position[1] + float, position[2]]}
      rotation={slot.rotation}
      subtitle={subtitle}
      title={title}
      width={1.32}
    />
  );
};

const carouselPose = (
  frame: number,
  phase: number,
  home: [number, number, number],
  orbit: [number, number, number],
  yawBase = 0,
) => {
  const spin = ((frame - 20) / REUSABLE_3D_KIT_SHOWCASE_DURATION) * Math.PI * 2;
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
  const enter = revealProgress(frame, delay, 42);
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
        screenTexturePath={screen.texturePath}
      />
    </group>
  );
};

const KitScene = ({ frame }: { frame: number }) => {
  const turn = clampEase(
    frame,
    [0, REUSABLE_3D_KIT_SHOWCASE_DURATION],
    [0.06, -0.06],
  );

  return (
    <>
      <StudioStage floorColor="#f7f7f7" floorSize={8.5} />
      <group position={[0, 0, 0]} rotation={[0.02, turn, 0]} scale={0.62}>
        <CarouselDevice
          baseY={-0.18}
          delay={0}
          deviceId="macbook-pro-m3-16-2024"
          fitTo={3.5}
          frame={frame}
          home={[0, -0.18, 0.14]}
          modelRotation={[0.14, 0, 0]}
          orbit={[0.18, 0.03, 0.14]}
          phase={Math.PI / 2}
          screen={{
            texturePath: "assets/skedez/dashboard.png",
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
          }}
        />

        <AnimatedCardExample
          accent="#15803d"
          delay={42}
          frame={frame}
          metric="+38%"
          slot={{
            from: [-3.34, 2.28, 0.24],
            target: [-2.5, 2.22, 0.32],
            rotation: [0.08, 0.28, -0.05],
          }}
          subtitle="Online bookings"
          title="Growth"
        />
        <AnimatedCardExample
          accent="#111111"
          dark
          delay={58}
          frame={frame}
          slot={{
            from: [3.36, 2.24, 0.24],
            target: [2.5, 2.22, 0.32],
            rotation: [0.05, -0.34, 0.04],
          }}
          subtitle="Email + WhatsApp"
          title="Reminders"
        />
        <AnimatedCardExample
          accent="#2454e6"
          delay={74}
          frame={frame}
          metric="12 synced"
          slot={{
            from: [0.24, 3.08, -0.22],
            target: [0.04, 2.58, -0.22],
            rotation: [0.08, -0.05, 0],
          }}
          subtitle="Calendar events"
          title="Sync"
        />

        <DataFlowLine
          color="#15803d"
          control={[0, 0.56, 1.12]}
          frame={frame}
          from={[-1.72, 0.28, 1.04]}
          pulseColor="#ffffff"
          to={[1.72, 0.28, 1.04]}
        />
        <TapRipple3D
          color="#2454e6"
          frame={frame}
          position={[1.5, 0.42, 1.2]}
          rotation={[0.05, -0.36, -0.08]}
          startFrame={92}
        />
        <SuccessBadge3D
          accent="#15803d"
          frame={frame}
          label="Booked"
          position={[0.9, 1.96, 0.82]}
          rotation={[0.04, -0.16, 0.03]}
          startFrame={110}
        />
      </group>
    </>
  );
};

export const Reusable3DKitShowcase = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 56% 24%, #ffffff 0%, #f8f8f8 48%, #ececec 100%)",
        overflow: "hidden",
      }}
    >
      <ThreeCanvas
        camera={{
          fov: 42,
          position: [0, 0.98, 7.9],
        }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
        }}
        height={height}
        shadows
        width={width}
      >
        <KitScene frame={frame + 20} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
