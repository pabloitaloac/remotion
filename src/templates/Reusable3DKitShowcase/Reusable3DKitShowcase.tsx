import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AppleDeviceModel } from "../../components/devices";
import {
  DataFlowLine,
  DeviceScreen3D,
  SaaSCard3D,
  StudioStage,
  SuccessBadge3D,
  TapRipple3D,
  clampEase,
  mixVector3,
  revealProgress,
} from "../../components/reusable3d";

export const REUSABLE_3D_KIT_SHOWCASE_DURATION = 240;

type Slot = {
  from: [number, number, number];
  target: [number, number, number];
  rotation: [number, number, number];
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

const animatedPosition = (
  frame: number,
  delay: number,
  from: [number, number, number],
  target: [number, number, number],
) => mixVector3(from, target, revealProgress(frame, delay, 38));

const KitScene = ({ frame }: { frame: number }) => {
  const turn = clampEase(
    frame,
    [0, REUSABLE_3D_KIT_SHOWCASE_DURATION],
    [0.16, -0.12],
  );
  const dashboardPosition = animatedPosition(
    frame,
    18,
    [0.1, 0.16, 1.3],
    [0.08, 0.66, 0.76],
  );
  const mobilePanelPosition = animatedPosition(
    frame,
    34,
    [-3.1, 0.46, 0.84],
    [-2.62, 0.8, 0.38],
  );

  return (
    <>
      <StudioStage floorColor="#f7f7f7" floorSize={8.5} />
      <group position={[0, 0, 0]} rotation={[0.02, turn, 0]} scale={0.63}>
        <group position={[0.08, -0.18, -0.28]} rotation={[0.02, -0.08, 0]}>
          <AppleDeviceModel deviceId="macbook-pro-m3-16-2024" fitTo={3.72} />
        </group>
        <group position={[2.18, 0.12, 0.6]} rotation={[0.08, -0.56, -0.08]}>
          <AppleDeviceModel deviceId="iphone-17-pro-max" fitTo={1.9} />
        </group>
        <group position={[-2.34, -0.02, 0.48]} rotation={[0.05, 0.2, -0.08]}>
          <AppleDeviceModel deviceId="ipad-pro-13-m4-silver" fitTo={1.98} />
        </group>

        <DeviceScreen3D
          accent="#15803d"
          delay={12}
          frame={frame}
          height={1.14}
          position={dashboardPosition}
          rotation={[0.02, 0.02, 0]}
          texturePath="assets/skedez/dashboard.png"
          width={1.7}
        />
        <DeviceScreen3D
          accent="#2454e6"
          delay={28}
          frame={frame}
          height={1.1}
          position={mobilePanelPosition}
          rotation={[0.03, 0.35, -0.12]}
          texturePath="assets/skedez/appointments-management.png"
          width={0.86}
        />

        <AnimatedCardExample
          accent="#15803d"
          delay={42}
          frame={frame}
          metric="+38%"
          slot={{
            from: [-3.34, 2.08, 0.24],
            target: [-2.48, 2.02, 0.28],
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
            from: [3.36, 2.0, 0.24],
            target: [2.5, 1.98, 0.28],
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
            from: [0.24, 3.0, -0.22],
            target: [0.04, 2.34, -0.22],
            rotation: [0.08, -0.05, 0],
          }}
          subtitle="Calendar events"
          title="Sync"
        />

        <DataFlowLine
          color="#15803d"
          control={[0.02, 1.42, 0.9]}
          frame={frame}
          from={[-1.5, 0.68, 0.56]}
          pulseColor="#ffffff"
          to={[1.5, 0.68, 0.72]}
        />
        <TapRipple3D
          color="#2454e6"
          frame={frame}
          position={[1.52, 0.7, 0.9]}
          rotation={[0.08, -0.52, -0.08]}
          startFrame={92}
        />
        <SuccessBadge3D
          accent="#15803d"
          frame={frame}
          label="Booked"
          position={[1.02, 1.5, 0.82]}
          rotation={[0.04, -0.24, 0.03]}
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
