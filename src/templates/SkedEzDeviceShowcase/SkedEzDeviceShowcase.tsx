import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import { CanvasTexture, DoubleSide, SRGBColorSpace } from "three";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AppleDeviceModel } from "../../components/devices";

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

type LabelTextureOptions = {
  title: string;
  subtitle: string;
  accent: string;
  dark?: boolean;
};

const ease = (
  frame: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(frame, input, output, {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const useLabelTexture = ({
  title,
  subtitle,
  accent,
  dark = false,
}: LabelTextureOptions) =>
  useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const context = canvas.getContext("2d");

    if (!context) {
      return new CanvasTexture(canvas);
    }

    context.fillStyle = dark ? colors.black : colors.white;
    context.beginPath();
    context.roundRect(0, 0, 1024, 512, 72);
    context.fill();

    context.strokeStyle = dark ? "rgba(255,255,255,0.16)" : colors.line;
    context.lineWidth = 8;
    context.stroke();

    context.fillStyle = accent;
    context.beginPath();
    context.roundRect(72, 72, 72, 72, 22);
    context.fill();

    context.fillStyle = dark ? colors.white : colors.black;
    context.font = "900 92px Arial, Helvetica, sans-serif";
    context.fillText(title, 184, 126);

    context.fillStyle = dark ? "rgba(255,255,255,0.68)" : colors.muted;
    context.font = "600 48px Arial, Helvetica, sans-serif";
    context.fillText(subtitle, 184, 218);

    context.fillStyle = dark ? "rgba(255,255,255,0.1)" : colors.panel;
    context.beginPath();
    context.roundRect(72, 304, 880, 86, 32);
    context.fill();

    context.fillStyle = accent;
    context.beginPath();
    context.roundRect(104, 334, 270, 26, 13);
    context.fill();

    context.fillStyle = dark ? "rgba(255,255,255,0.5)" : "#c4c4c4";
    context.beginPath();
    context.roundRect(408, 334, 210, 26, 13);
    context.roundRect(650, 334, 168, 26, 13);
    context.fill();

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;

    return texture;
  }, [accent, dark, subtitle, title]);

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
  const x = Math.cos(orbit) * 2.16;
  const z = Math.sin(orbit) * 1.04 + 0.5;

  return (
    <group
      position={[x, lift, z]}
      rotation={[0.1, -0.58 + finalTurn - orbit * 0.18, -0.13]}
    >
      <AppleDeviceModel deviceId="iphone-17-pro-max" fitTo={2.42} />
    </group>
  );
};

const IPad = ({ frame }: { frame: number }) => {
  const reveal = ease(frame, [78, 150], [0.12, 1]);
  const drift = Math.sin(frame / 36) * 0.16;
  const rotate = ease(frame, [80, 300], [0.34, -0.22]);

  return (
    <group
      position={[-1.42, 0.12 + drift, 0.48]}
      rotation={[0.04, -0.12 + rotate, -0.1]}
      scale={reveal}
    >
      <AppleDeviceModel deviceId="ipad-pro-13-m4-silver" fitTo={2.52} />
    </group>
  );
};

const FloatingCard = ({
  frame,
  index,
  title,
  subtitle,
  accent,
  dark,
}: {
  frame: number;
  index: number;
  title: string;
  subtitle: string;
  accent: string;
  dark?: boolean;
}) => {
  const texture = useLabelTexture({ title, subtitle, accent, dark });
  const reveal = ease(frame, [120 + index * 14, 164 + index * 14], [0, 1]);
  const orbit = frame / 62 + index * 1.48;
  const radius = 2.95 + index * 0.1;
  const y = 1.1 + Math.sin(frame / 34 + index) * 0.18;

  return (
    <mesh
      position={[Math.cos(orbit) * radius, y, Math.sin(orbit) * 1.36 - 0.2]}
      rotation={[0.08, -0.16, 0.02]}
      scale={[reveal, reveal, reveal]}
    >
      <planeGeometry args={[1.72, 0.86]} />
      <meshBasicMaterial
        map={texture}
        side={DoubleSide}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
};

const Stage = ({ frame }: { frame: number }) => (
  <>
    <ambientLight intensity={1.25} />
    <directionalLight
      castShadow
      intensity={2.2}
      position={[-2, 5, 4]}
      shadow-mapSize-height={2048}
      shadow-mapSize-width={2048}
    />
    <pointLight color="#ffffff" intensity={28} position={[2.8, 2.4, 2.2]} />

    <group
      position={[0, 0.18, 0]}
      rotation={[
        ease(frame, [0, 300], [-0.05, 0.04]),
        ease(frame, [0, 300], [0.28, -0.24]),
        0,
      ]}
      scale={0.64}
    >
      <mesh
        receiveShadow
        position={[0, -1.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[9, 9, 24, 24]} />
        <meshStandardMaterial color="#f6f6f6" roughness={0.62} />
      </mesh>
      <gridHelper
        args={[9, 18, "#e0e0e0", "#eeeeee"]}
        position={[0, -1.115, 0]}
      />
      <MacBook frame={frame} />
      <IPhone frame={frame} />
      <IPad frame={frame} />
      <FloatingCard
        accent={colors.green}
        frame={frame}
        index={0}
        subtitle="24/7 online scheduling"
        title="Bookings"
      />
      <FloatingCard
        accent={colors.black}
        dark
        frame={frame}
        index={1}
        subtitle="Email + WhatsApp"
        title="Reminders"
      />
      <FloatingCard
        accent={colors.blue}
        frame={frame}
        index={2}
        subtitle="Google Calendar sync"
        title="Calendar"
      />
      <FloatingCard
        accent={colors.green}
        frame={frame}
        index={3}
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
