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
} from "../../components/reusable3d";

export const REUSABLE_3D_KIT_SHOWCASE_DURATION = 240;

const KitScene = ({ frame }: { frame: number }) => {
  const turn = clampEase(
    frame,
    [0, REUSABLE_3D_KIT_SHOWCASE_DURATION],
    [0.22, -0.2],
  );

  return (
    <>
      <StudioStage floorColor="#f7f7f7" floorSize={8.5} />
      <group position={[0, 0.05, 0]} rotation={[0.02, turn, 0]} scale={0.72}>
        <group position={[0, -0.1, -0.25]} rotation={[0.02, -0.1, 0]}>
          <AppleDeviceModel deviceId="macbook-pro-m3-16-2024" fitTo={4.15} />
        </group>
        <group position={[1.75, 0.22, 0.5]} rotation={[0.08, -0.52, -0.08]}>
          <AppleDeviceModel deviceId="iphone-17-pro-max" fitTo={2.25} />
        </group>
        <group position={[-1.55, 0.1, 0.48]} rotation={[0.05, 0.18, -0.08]}>
          <AppleDeviceModel deviceId="ipad-pro-13-m4-silver" fitTo={2.45} />
        </group>

        <DeviceScreen3D
          accent="#15803d"
          delay={12}
          frame={frame}
          height={1.14}
          position={[0, 0.58, 0.68]}
          rotation={[0.02, 0.02, 0]}
          texturePath="assets/skedez/dashboard.png"
          width={2.04}
        />
        <DeviceScreen3D
          accent="#2454e6"
          delay={28}
          frame={frame}
          height={1.35}
          position={[-2.26, 0.82, 0.3]}
          rotation={[0.03, 0.35, -0.12]}
          texturePath="assets/skedez/appointments-management.png"
          width={1.05}
        />

        <SaaSCard3D
          accent="#15803d"
          delay={42}
          frame={frame}
          metric="+38%"
          position={[-2.3, 1.55, 0.02]}
          rotation={[0.08, 0.28, -0.05]}
          subtitle="Online bookings"
          title="Growth"
        />
        <SaaSCard3D
          accent="#111111"
          dark
          delay={58}
          frame={frame}
          position={[1.95, 1.48, 0.05]}
          rotation={[0.05, -0.34, 0.04]}
          subtitle="Email + WhatsApp"
          title="Reminders"
        />
        <SaaSCard3D
          accent="#2454e6"
          delay={74}
          frame={frame}
          metric="12 synced"
          position={[0.05, 2.02, -0.18]}
          rotation={[0.08, -0.05, 0]}
          subtitle="Calendar events"
          title="Sync"
        />

        <DataFlowLine
          color="#15803d"
          control={[0.2, 1.85, 0.8]}
          frame={frame}
          from={[-1.4, 0.84, 0.52]}
          pulseColor="#ffffff"
          to={[1.55, 0.82, 0.56]}
        />
        <TapRipple3D
          color="#2454e6"
          frame={frame}
          position={[1.62, 0.74, 0.78]}
          rotation={[0.08, -0.52, -0.08]}
          startFrame={92}
        />
        <SuccessBadge3D
          accent="#15803d"
          frame={frame}
          label="Booked"
          position={[1.42, 1.62, 0.74]}
          rotation={[0.04, -0.38, 0.03]}
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
