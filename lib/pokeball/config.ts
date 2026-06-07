export type Finish = "glossy" | "matte" | "metallic";
export type Pattern = "classic" | "stripe" | "split" | "accent";
export type Lighting = "studio" | "sunset" | "night";
export type Backdrop = "graphite" | "sky" | "mint" | "plum";

export type PokeballConfig = {
  topColor: string;
  bottomColor: string;
  bandColor: string;
  buttonColor: string;
  buttonHighlightColor: string;
  finish: Finish;
  pattern: Pattern;
  lighting: Lighting;
  backdrop: Backdrop;
  spin: boolean;
};

export const defaultConfig: PokeballConfig = {
  topColor: "#e53935",
  bottomColor: "#f7f7f2",
  bandColor: "#18181b",
  buttonColor: "#f8fafc",
  buttonHighlightColor: "#ffffff",
  finish: "glossy",
  pattern: "classic",
  lighting: "studio",
  backdrop: "graphite",
  spin: false,
};

export const colorPresets = [
  "#e53935",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#14b8a6",
  "#38bdf8",
  "#6366f1",
  "#d946ef",
  "#f8fafc",
  "#18181b",
];

export const backdropClass: Record<Backdrop, string> = {
  graphite: "from-zinc-950 via-stone-900 to-slate-950",
  sky: "from-sky-200 via-cyan-100 to-amber-100",
  mint: "from-emerald-100 via-teal-50 to-slate-200",
  plum: "from-fuchsia-950 via-indigo-950 to-rose-950",
};

export const materialByFinish: Record<
  Finish,
  { roughness: number; metalness: number }
> = {
  glossy: { roughness: 0.18, metalness: 0.05 },
  matte: { roughness: 0.72, metalness: 0 },
  metallic: { roughness: 0.28, metalness: 0.56 },
};

export const finishOptions: { label: string; value: Finish }[] = [
  { label: "Glossy", value: "glossy" },
  { label: "Matte", value: "matte" },
  { label: "Metallic", value: "metallic" },
];

export const patternOptions: { label: string; value: Pattern }[] = [
  { label: "Classic", value: "classic" },
  { label: "Stripe", value: "stripe" },
  { label: "Split", value: "split" },
  { label: "Accent", value: "accent" },
];

export const lightingOptions: { label: string; value: Lighting }[] = [
  { label: "Studio", value: "studio" },
  { label: "Sunset", value: "sunset" },
  { label: "Night", value: "night" },
];

export const backdropOptions: { label: string; value: Backdrop }[] = [
  { label: "Graphite", value: "graphite" },
  { label: "Sky", value: "sky" },
  { label: "Mint", value: "mint" },
  { label: "Plum", value: "plum" },
];
