export type Vector3Tuple = [number, number, number];

export type ThemeMode = "light" | "dark";

export type BrandTheme = {
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  panel: string;
  line: string;
};

export const defaultLightTheme: BrandTheme = {
  accent: "#15803d",
  background: "#ffffff",
  foreground: "#111111",
  muted: "#737373",
  panel: "#f4f4f4",
  line: "#e0e0e0",
};

export const defaultDarkTheme: BrandTheme = {
  accent: "#2454e6",
  background: "#111111",
  foreground: "#ffffff",
  muted: "rgba(255,255,255,0.68)",
  panel: "rgba(255,255,255,0.1)",
  line: "rgba(255,255,255,0.16)",
};
