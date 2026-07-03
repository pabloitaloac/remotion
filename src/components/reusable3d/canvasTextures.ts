import { CanvasTexture, SRGBColorSpace } from "three";
import { BrandTheme, defaultDarkTheme, defaultLightTheme } from "./types";

export type CardTextureOptions = {
  title: string;
  subtitle: string;
  metric?: string;
  accent?: string;
  dark?: boolean;
};

export type BadgeTextureOptions = {
  label: string;
  accent?: string;
  dark?: boolean;
};

const getContext = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  return { canvas, context };
};

const toTexture = (canvas: HTMLCanvasElement) => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;

  return texture;
};

const getTheme = (dark?: boolean, accent?: string): BrandTheme => ({
  ...(dark ? defaultDarkTheme : defaultLightTheme),
  ...(accent ? { accent } : {}),
});

export const createSaaSCardTexture = ({
  title,
  subtitle,
  metric,
  accent,
  dark = false,
}: CardTextureOptions) => {
  const { canvas, context } = getContext(1200, 640);
  const theme = getTheme(dark, accent);

  if (!context) {
    return toTexture(canvas);
  }

  context.fillStyle = theme.background;
  context.beginPath();
  context.roundRect(0, 0, canvas.width, canvas.height, 80);
  context.fill();

  context.strokeStyle = theme.line;
  context.lineWidth = 8;
  context.stroke();

  context.fillStyle = theme.accent;
  context.beginPath();
  context.roundRect(74, 72, 80, 80, 24);
  context.fill();

  context.fillStyle = theme.foreground;
  context.font = "900 96px Arial, Helvetica, sans-serif";
  context.fillText(title, 188, 132);

  context.fillStyle = theme.muted;
  context.font = "600 52px Arial, Helvetica, sans-serif";
  context.fillText(subtitle, 188, 224);

  context.fillStyle = theme.panel;
  context.beginPath();
  context.roundRect(74, 330, 1052, 110, 36);
  context.fill();

  context.fillStyle = theme.accent;
  context.beginPath();
  context.roundRect(112, 370, 340, 30, 15);
  context.fill();

  context.fillStyle = dark ? "rgba(255,255,255,0.42)" : "#c4c4c4";
  context.beginPath();
  context.roundRect(500, 370, 260, 30, 15);
  context.roundRect(804, 370, 210, 30, 15);
  context.fill();

  if (metric) {
    context.fillStyle = theme.foreground;
    context.font = "900 90px Arial, Helvetica, sans-serif";
    context.fillText(metric, 78, 564);
  }

  return toTexture(canvas);
};

export const createBadgeTexture = ({
  label,
  accent,
  dark = false,
}: BadgeTextureOptions) => {
  const { canvas, context } = getContext(512, 512);
  const theme = getTheme(dark, accent);

  if (!context) {
    return toTexture(canvas);
  }

  context.fillStyle = theme.background;
  context.beginPath();
  context.arc(256, 256, 230, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = theme.accent;
  context.lineWidth = 28;
  context.stroke();

  context.strokeStyle = theme.accent;
  context.lineWidth = 42;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(156, 262);
  context.lineTo(226, 332);
  context.lineTo(370, 182);
  context.stroke();

  context.fillStyle = theme.foreground;
  context.font = "800 42px Arial, Helvetica, sans-serif";
  context.textAlign = "center";
  context.fillText(label, 256, 430);

  return toTexture(canvas);
};
