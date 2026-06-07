import { defaultConfig, type PokeballConfig } from "./config";

type SearchParamValue = string | string[] | undefined;
type SearchParamsRecord = Record<string, SearchParamValue>;
type ConfigSearchParams = URLSearchParams | SearchParamsRecord;

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

function getParam(params: ConfigSearchParams, key: string) {
  if (params instanceof URLSearchParams) {
    return params.get(key);
  }

  const value = params[key];
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export function parseConfigFromSearchParams(
  params: ConfigSearchParams,
): PokeballConfig {
  const next = { ...defaultConfig };
  const top = getParam(params, queryKeys.topColor);
  const bottom = getParam(params, queryKeys.bottomColor);
  const band = getParam(params, queryKeys.bandColor);
  const button = getParam(params, queryKeys.buttonColor);
  const highlight = getParam(params, queryKeys.buttonHighlightColor);
  const finish = getParam(params, queryKeys.finish);
  const pattern = getParam(params, queryKeys.pattern);
  const lighting = getParam(params, queryKeys.lighting);
  const backdrop = getParam(params, queryKeys.backdrop);
  const spin = getParam(params, queryKeys.spin);

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

export function readConfigFromUrl(): PokeballConfig {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  return parseConfigFromSearchParams(
    new URLSearchParams(window.location.search),
  );
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
