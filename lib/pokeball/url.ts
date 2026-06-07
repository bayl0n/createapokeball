import { defaultConfig, type PokeballConfig } from "./config";

const queryKeys = {
  topColor: "top",
  bottomColor: "bottom",
  bandColor: "band",
  buttonColor: "button",
  buttonHighlightColor: "highlight",
  finish: "finish",
  pattern: "pattern",
  lighting: "lighting",
  backdrop: "backdrop",
  spin: "spin",
} as const;

function isHexColor(value: string | null): value is string {
  return Boolean(value?.match(/^#[0-9a-fA-F]{6}$/));
}

export function readConfigFromUrl(): PokeballConfig {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  const params = new URLSearchParams(window.location.search);
  const next = { ...defaultConfig };
  const top = params.get(queryKeys.topColor);
  const bottom = params.get(queryKeys.bottomColor);
  const band = params.get(queryKeys.bandColor);
  const button = params.get(queryKeys.buttonColor);
  const highlight = params.get(queryKeys.buttonHighlightColor);
  const finish = params.get(queryKeys.finish);
  const pattern = params.get(queryKeys.pattern);
  const lighting = params.get(queryKeys.lighting);
  const backdrop = params.get(queryKeys.backdrop);
  const spin = params.get(queryKeys.spin);

  if (isHexColor(top)) next.topColor = top;
  if (isHexColor(bottom)) next.bottomColor = bottom;
  if (isHexColor(band)) next.bandColor = band;
  if (isHexColor(button)) next.buttonColor = button;
  if (isHexColor(highlight)) next.buttonHighlightColor = highlight;
  if (finish === "glossy" || finish === "matte" || finish === "metallic") {
    next.finish = finish;
  }
  if (
    pattern === "classic" ||
    pattern === "stripe" ||
    pattern === "split" ||
    pattern === "accent"
  ) {
    next.pattern = pattern;
  }
  if (lighting === "studio" || lighting === "sunset" || lighting === "night") {
    next.lighting = lighting;
  }
  if (
    backdrop === "graphite" ||
    backdrop === "sky" ||
    backdrop === "mint" ||
    backdrop === "plum"
  ) {
    next.backdrop = backdrop;
  }
  if (spin === "0" || spin === "1") next.spin = spin === "1";

  return next;
}

export function configToSearchParams(config: PokeballConfig) {
  const params = new URLSearchParams();
  params.set(queryKeys.topColor, config.topColor);
  params.set(queryKeys.bottomColor, config.bottomColor);
  params.set(queryKeys.bandColor, config.bandColor);
  params.set(queryKeys.buttonColor, config.buttonColor);
  params.set(queryKeys.buttonHighlightColor, config.buttonHighlightColor);
  params.set(queryKeys.finish, config.finish);
  params.set(queryKeys.pattern, config.pattern);
  params.set(queryKeys.lighting, config.lighting);
  params.set(queryKeys.backdrop, config.backdrop);
  params.set(queryKeys.spin, config.spin ? "1" : "0");
  return params;
}
