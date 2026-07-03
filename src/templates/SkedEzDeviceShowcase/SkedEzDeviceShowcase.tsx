import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AppleDeviceModel } from "../../components/devices";
import {
  DataFlowLine,
  SaaSCard3D,
  StudioStage,
  SuccessBadge3D,
  TapRipple3D,
  clampEase,
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

const MacBook = ({ frame }: { frame: number }) => {
  const open = ease(frame, [0, 72], [-0.04, 0.18]);
  const settle = Math.sin(frame / 24) * 0.018;

  return (
    <group
      position={[0, -0.16 + settle, -0.1]}
      rotation={[0.03, ease(frame, [0, 300], [-0.24, 0.18]), 0]}
    >
      <AppleDeviceModel
        deviceId="macbook-pro-m3-16-2024"
        fitTo={4.35}
        rotation={[open, 0, 0]}
      />
    </group>
  );
};

const IPhone = ({ frame }: { frame: number }) => {
  const orbit = ease(frame, [56, 188], [-1.2, 0.36]);
  const lift = ease(frame, [56, 140], [-0.7, 0.28]);
  const finalTurn = ease(frame, [210, 300], [0, -0.28]);
  const x = Math.cos(orbit) * 2.32 + 0.1;
  const z = Math.sin(orbit) * 0.98 + 0.5;

  return (
    <group
      position={[x, lift, z]}
      rotation={[0.1, -0.58 + finalTurn - orbit * 0.18, -0.13]}
    >
      <AppleDeviceModel deviceId="iphone-17-pro-max" fitTo={2.26} />
    </group>
  );
};

const IPad = ({ frame }: { frame: number }) => {
  const reveal = ease(frame, [78, 150], [0.12, 1]);
  const drift = Math.sin(frame / 36) * 0.16;
  const rotate = ease(frame, [80, 300], [0.34, -0.22]);

  return (
    <group
      position={[-2.14, 0.02 + drift * 0.7, 0.42]}
      rotation={[0.04, -0.12 + rotate, -0.1]}
      scale={reveal}
    >
      <AppleDeviceModel deviceId="ipad-pro-13-m4-silver" fitTo={2.1} />
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
        ease(frame, [0, 300], [0.28, -0.24]),
        0,
      ]}
      scale={0.64}
    >
      <MacBook frame={frame} />
      <IPhone frame={frame} />
      <IPad frame={frame} />
      <DataFlowLine
        color={colors.green}
        control={[0.08, 1.22, 0.92]}
        frame={frame}
        from={[-1.12, 0.52, 0.52]}
        pulseColor="#ffffff"
        to={[1.46, 0.56, 0.78]}
      />
      <TapRipple3D
        color={colors.blue}
        frame={frame}
        position={[1.44, 0.58, 0.96]}
        rotation={[0.1, -0.7, -0.12]}
        startFrame={116}
      />
      <SuccessBadge3D
        accent={colors.green}
        frame={frame}
        label="Booked"
        position={[0.82, 1.34, 0.9]}
        rotation={[0.04, -0.16, 0.02]}
        startFrame={154}
      />
      <WorkflowCard
        accent={colors.green}
        frame={frame}
        index={0}
        metric="+24%"
        slot={{
          from: [-3.28, 1.78, 0.42],
          target: [-2.36, 1.74, 0.58],
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
          from: [2.64, 2.18, 0.0],
          target: [0.9, 2.16, -0.04],
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
          from: [3.36, 1.72, 0.5],
          target: [2.5, 1.66, 0.58],
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
          from: [-0.28, 2.9, -0.34],
          target: [-0.72, 2.34, -0.2],
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
  const cameraZ = ease(frame, [0, 120], [9.2, 7.8]);
  const cameraY = ease(frame, [0, 300], [1.02, 0.92]);

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
