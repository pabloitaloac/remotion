import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
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

export const REUSABLE_3D_KIT_SHOWCASE_DURATION = 240;

type Slot = {
  from: [number, number, number];
  target: [number, number, number];
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
  const lift = Math.sin(enter * Math.PI) * 0.32;
  const spin = (1 - enter) * spinTurns * Math.PI * 2;
  const rotation: [number, number, number] = [
    finalRotation[0] + (1 - enter) * 0.2,
    finalRotation[1] + spin,
    finalRotation[2] + (1 - enter) * 0.16,
  ];
  const idleFloat =
    frame > startFrame + durationInFrames
      ? Math.sin((frame - startFrame) / 42) * 0.024
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

const KitScene = ({ frame }: { frame: number }) => {
  const turn = clampEase(
    frame,
    [0, REUSABLE_3D_KIT_SHOWCASE_DURATION],
    [0.035, -0.035],
  );

  return (
    <>
      <StudioStage floorColor="#f7f7f7" floorSize={8.5} />
      <group position={[0, 0, 0]} rotation={[0.02, turn, 0]} scale={0.58}>
        <PresentedDevice
          baseScale={0.98}
          deviceId="ipad-pro-13-m4-silver"
          durationInFrames={58}
          finalRotation={[0.01, 0.03, -0.04]}
          fitTo={1.62}
          frame={frame}
          modelRotation={[0, -Math.PI / 2, 0]}
          from={[-4.3, 0.82, 0.62]}
          spinTurns={1.15}
          startFrame={0}
          target={[-2.58, 0.1, 0.52]}
          screen={{
            texturePath: "assets/skedez/smart-calendar.png",
          }}
        />
        <PresentedDevice
          baseScale={0.96}
          deviceId="iphone-17-pro-max"
          durationInFrames={58}
          finalRotation={[0.02, -0.08, 0.06]}
          fitTo={1.58}
          frame={frame}
          modelRotation={[0, Math.PI / 2, 0]}
          from={[5.45, 0.9, 0.62]}
          spinTurns={1.3}
          startFrame={42}
          target={[2.58, 0.14, 0.56]}
          screen={{
            texturePath: "assets/skedez/appointments-management.png",
          }}
        />
        <PresentedDevice
          baseScale={1}
          deviceId="macbook-pro-m3-16-2024"
          durationInFrames={66}
          finalRotation={[0.01, 0, 0]}
          fitTo={3.16}
          frame={frame}
          from={[0, -3.1, -1.45]}
          modelRotation={[0.14, 0, 0]}
          spinTurns={0.78}
          startFrame={88}
          target={[0, -0.34, 0.16]}
          screen={{
            texturePath: "assets/skedez/dashboard.png",
          }}
        />

        <AnimatedCardExample
          accent="#15803d"
          delay={156}
          frame={frame}
          metric="+38%"
          slot={{
            from: [-3.45, 2.8, 0.78],
            target: [-2.54, 2.66, 0.96],
            rotation: [0.06, 0.2, -0.05],
          }}
          subtitle="Online bookings"
          title="Growth"
        />
        <AnimatedCardExample
          accent="#111111"
          dark
          delay={170}
          frame={frame}
          slot={{
            from: [3.45, 2.8, 0.78],
            target: [2.54, 2.66, 0.96],
            rotation: [0.05, -0.2, 0.04],
          }}
          subtitle="Email + WhatsApp"
          title="Reminders"
        />
        <AnimatedCardExample
          accent="#2454e6"
          delay={184}
          frame={frame}
          metric="12 synced"
          slot={{
            from: [0, -2.18, 1.54],
            target: [0, -1.72, 1.66],
            rotation: [-0.08, 0, 0],
          }}
          subtitle="Calendar events"
          title="Sync"
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
