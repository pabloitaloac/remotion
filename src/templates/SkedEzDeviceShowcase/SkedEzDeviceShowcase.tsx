import { RoundedBox } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CanvasTexture, DoubleSide, SRGBColorSpace } from "three";
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

type BrandPanelSlot = WorkflowCardSlot;

type ScreenPlacement = {
  texturePath: string;
};

type BrandPanelTextureOptions = {
  title: string;
  subtitle: string;
  tag?: string;
  accent: string;
  dark?: boolean;
};

type PresentedDeviceProps = {
  frame: number;
  deviceId: AppleDeviceId;
  fitTo: number;
  from: [number, number, number];
  arcControl: [number, number, number];
  depthControl: [number, number, number];
  target: [number, number, number];
  finalRotation: [number, number, number];
  startFrame: number;
  durationInFrames: number;
  baseScale?: number;
  modelRotation?: [number, number, number];
  screen: ScreenPlacement;
  spinTurns?: number;
  pathTiming?: "fast" | "linear" | "smooth";
};

const PresentedDevice = ({
  frame,
  deviceId,
  fitTo,
  from,
  arcControl,
  depthControl,
  target,
  finalRotation,
  startFrame,
  durationInFrames,
  baseScale = 1,
  modelRotation = [0, 0, 0],
  screen,
  spinTurns = 1,
  pathTiming = "fast",
}: PresentedDeviceProps) => {
  const enter =
    pathTiming === "smooth"
      ? ease(frame, [startFrame, startFrame + durationInFrames], [0, 1])
      : pathTiming === "linear"
        ? Math.min(1, Math.max(0, (frame - startFrame) / durationInFrames))
        : revealProgress(frame, startFrame, durationInFrames);
  const curveStart = mixVector3(from, arcControl, enter);
  const curveMiddle = mixVector3(arcControl, depthControl, enter);
  const curveEnd = mixVector3(depthControl, target, enter);
  const firstArc = mixVector3(curveStart, curveMiddle, enter);
  const secondArc = mixVector3(curveMiddle, curveEnd, enter);
  const position = mixVector3(firstArc, secondArc, enter);
  const lift = Math.sin(enter * Math.PI) * 0.2;
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
  const scale = frame < startFrame ? 0 : baseScale * mix(0.72, 1, enter);

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
  const delay = 88 + index * 8;
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

const createSkedEzBrandTexture = ({
  title,
  subtitle,
  tag,
  accent,
  dark = false,
}: BrandPanelTextureOptions) => {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 360;
  const context = canvas.getContext("2d");
  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;

  if (!context) {
    return texture;
  }

  const background = dark ? colors.black : colors.white;
  const foreground = dark ? colors.white : colors.black;
  const muted = dark ? "rgba(255,255,255,0.64)" : colors.muted;
  const border = dark ? "rgba(255,255,255,0.14)" : colors.line;
  const panel = dark ? "rgba(255,255,255,0.1)" : colors.panel;

  context.fillStyle = background;
  context.beginPath();
  context.roundRect(0, 0, canvas.width, canvas.height, 72);
  context.fill();

  context.strokeStyle = border;
  context.lineWidth = 8;
  context.stroke();

  context.fillStyle = accent;
  context.beginPath();
  context.roundRect(58, 74, 126, 126, 34);
  context.fill();

  context.fillStyle = "#ffffff";
  context.fillRect(88, 108, 66, 12);
  context.fillRect(88, 138, 66, 12);
  context.fillRect(88, 168, 42, 12);
  context.fillRect(142, 168, 12, 12);

  context.fillStyle = foreground;
  context.font = "900 88px Arial, Helvetica, sans-serif";
  context.fillText(title, 222, 136);

  context.fillStyle = muted;
  context.font = "700 44px Arial, Helvetica, sans-serif";
  context.fillText(subtitle, 224, 204);

  context.fillStyle = panel;
  context.beginPath();
  context.roundRect(222, 250, tag ? 430 : 312, 58, 28);
  context.fill();

  context.fillStyle = accent;
  context.beginPath();
  context.roundRect(252, 271, 126, 16, 8);
  context.fill();

  context.fillStyle = dark ? "rgba(255,255,255,0.4)" : "#c9c9c9";
  context.beginPath();
  context.roundRect(406, 271, 176, 16, 8);
  context.fill();

  if (tag) {
    context.fillStyle = accent;
    context.beginPath();
    context.roundRect(694, 78, 188, 62, 31);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "900 32px Arial, Helvetica, sans-serif";
    context.textAlign = "center";
    context.fillText(tag, 788, 119);
    context.textAlign = "left";
  }

  texture.needsUpdate = true;

  return texture;
};

const BrandPanel3D = ({
  frame,
  title,
  subtitle,
  tag,
  accent,
  dark,
  delay,
  slot,
  width,
  height,
}: {
  frame: number;
  title: string;
  subtitle: string;
  tag?: string;
  accent: string;
  dark?: boolean;
  delay: number;
  slot: BrandPanelSlot;
  width: number;
  height: number;
}) => {
  const texture = useMemo(
    () => createSkedEzBrandTexture({ title, subtitle, tag, accent, dark }),
    [accent, dark, subtitle, tag, title],
  );
  const enter = revealProgress(frame, delay, 42);
  const position = mixVector3(slot.from, slot.target, enter);
  const holdFloat = Math.sin((frame + delay) / 38) * 0.035 * enter;

  return (
    <group
      position={[position[0], position[1] + holdFloat, position[2]]}
      rotation={slot.rotation}
      scale={enter * mix(0.82, 1, enter)}
    >
      <RoundedBox args={[width, height, 0.045]} radius={0.08} smoothness={8}>
        <meshStandardMaterial
          color={dark ? colors.black : colors.white}
          metalness={0.04}
          roughness={0.34}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.028]}>
        <planeGeometry args={[width * 0.96, height * 0.9]} />
        <meshBasicMaterial
          map={texture}
          side={DoubleSide}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const SkedEzBranding3D = ({ frame }: { frame: number }) => (
  <>
    <BrandPanel3D
      accent={colors.green}
      delay={84}
      frame={frame}
      height={0.52}
      slot={{
        from: [0, 4.58, 0.7],
        target: [0, 4.06, 0.92],
        rotation: [0.04, 0, 0],
      }}
      subtitle="Smart scheduling for service teams"
      tag="PLATFORM"
      title="SkedEz"
      width={1.76}
    />
    <BrandPanel3D
      accent={colors.green}
      delay={96}
      frame={frame}
      height={0.44}
      slot={{
        from: [-4.1, 1.54, 0.9],
        target: [-2.82, 1.42, 1.22],
        rotation: [0.04, 0.24, -0.04],
      }}
      subtitle="Booking flow"
      tag="24/7"
      title="Online"
      width={1.24}
    />
    <BrandPanel3D
      accent={colors.blue}
      dark
      delay={104}
      frame={frame}
      height={0.44}
      slot={{
        from: [4.1, 1.54, 0.9],
        target: [2.82, 1.42, 1.22],
        rotation: [0.04, -0.24, 0.04],
      }}
      subtitle="WhatsApp ready"
      tag="AUTO"
      title="Remind"
      width={1.24}
    />
  </>
);

const Stage = ({ frame }: { frame: number }) => (
  <>
    <StudioStage showFloor={false} showGrid={false} />

    <group
      position={[0, 0.02, 0]}
      rotation={[
        ease(frame, [0, 300], [-0.03, 0.025]),
        ease(frame, [0, 300], [0.04, -0.04]),
        0,
      ]}
      scale={0.6}
    >
      <PresentedDevice
        baseScale={0.98}
        deviceId="ipad-pro-13-m4-silver"
        durationInFrames={70}
        finalRotation={[0.01, 0.03, -0.04]}
        fitTo={1.62}
        frame={frame}
        modelRotation={[0, -Math.PI / 2, 0]}
        from={[5.6, -10.2, 7.52]}
        arcControl={[6.7, -6.4, 7.08]}
        depthControl={[-4.6, -1.9, 3.18]}
        pathTiming="smooth"
        spinTurns={1.32}
        startFrame={-36}
        target={[-2.42, 0.08, 0.52]}
        screen={{
          texturePath: "assets/skedez/smart-calendar.png",
        }}
      />
      <PresentedDevice
        baseScale={0.96}
        deviceId="iphone-17-pro-max"
        durationInFrames={70}
        finalRotation={[0.02, -0.08, 0.06]}
        fitTo={1.58}
        frame={frame}
        modelRotation={[0, Math.PI / 2, 0]}
        from={[-4.8, 8.4, 7.52]}
        arcControl={[-6.2, 6.3, 7.08]}
        depthControl={[4.2, 3.2, 3.18]}
        pathTiming="smooth"
        spinTurns={1.32}
        startFrame={-18}
        target={[2.42, 0.12, 0.56]}
        screen={{
          texturePath: "assets/skedez/appointments-management.png",
        }}
      />
      <PresentedDevice
        baseScale={1}
        deviceId="macbook-pro-m3-16-2024"
        durationInFrames={70}
        finalRotation={[0.01, 0, 0]}
        fitTo={3.16}
        frame={frame}
        from={[2.2, -10.8, 7.42]}
        arcControl={[5.62, -6.72, 7.06]}
        depthControl={[1.78, -2.52, 3.18]}
        modelRotation={[0.14, 0, 0]}
        pathTiming="smooth"
        spinTurns={1.32}
        startFrame={6}
        target={[0, -0.48, 0.16]}
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
          from: [-3.24, 2.98, 0.82],
          target: [-2.36, 2.82, 1],
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
          from: [0, 3.56, 0.74],
          target: [0, 3.16, 0.84],
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
          from: [3.24, 2.98, 0.82],
          target: [2.36, 2.82, 1],
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
          from: [0, -2.86, 1.58],
          target: [0, -2.48, 1.68],
          rotation: [-0.08, 0, 0],
        }}
        subtitle="No-shows and revenue"
        title="Analytics"
      />
      <SkedEzBranding3D frame={frame} />
    </group>
  </>
);

const BrandOverlay = ({ frame }: { frame: number }) => {
  const enter = revealProgress(frame, 0, 34);
  const settle = revealProgress(frame, 34, 24);
  const idle = Math.sin(frame / 42) * 0.012 * settle;
  const iconTurn = mix(-0.18, 0, enter) + Math.sin(frame / 36) * 0.015 * settle;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 48,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: enter,
          transform: `translateY(${mix(-18, 0, enter)}px) scale(${
            mix(0.88, 1, enter) + idle
          })`,
          transformOrigin: "left center",
        }}
      >
        <Img
          src={staticFile("assets/skedez/icon.png")}
          style={{
            filter: `drop-shadow(0 ${mix(12, 4, enter)}px ${mix(
              18,
              10,
              enter,
            )}px rgba(0,0,0,${mix(0, 0.14, enter)}))`,
            height: 46,
            transform: `rotate(${iconTurn}rad)`,
            width: 46,
          }}
        />
        <div
          style={{
            color: colors.black,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 40,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          SkedEz
        </div>
      </div>
    </AbsoluteFill>
  );
};

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
      <BrandOverlay frame={frame} />
    </AbsoluteFill>
  );
};
