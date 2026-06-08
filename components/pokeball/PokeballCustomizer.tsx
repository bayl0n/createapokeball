"use client";

import { RotateCcw, Download, Rotate3d, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { WebGLRenderer } from "three";
import {
  backdropClass,
  backdropOptions,
  defaultConfig,
  finishOptions,
  letteringMaxLength,
  lightingOptions,
  patternOptions,
  type PokeballConfig,
} from "../../lib/pokeball/config";
import { configToSearchParams } from "../../lib/pokeball/url";
import { ColorControl } from "./controls/ColorControl";
import { SegmentedControl } from "./controls/SegmentedControl";
import { Scene } from "./scene/Scene";

export function PokeballCustomizer({
  initialConfig,
}: {
  initialConfig: PokeballConfig;
}) {
  const [config, setConfig] = useState<PokeballConfig>(initialConfig);
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);
  const [copyStatus, setCopyStatus] = useState("Copy link");
  const [exportStatus, setExportStatus] = useState("Download");

  useEffect(() => {
    const params = configToSearchParams(config);
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
  }, [config]);

  function updateConfig<K extends keyof PokeballConfig>(
    key: K,
    value: PokeballConfig[K],
  ) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function updatePattern(value: PokeballConfig["pattern"]) {
    setConfig((current) => ({
      ...current,
      pattern: value,
    }));
  }

  async function copyShareUrl() {
    const url = `${window.location.origin}${window.location.pathname}?${configToSearchParams(config).toString()}`;
    await navigator.clipboard.writeText(url);
    setCopyStatus("Copied");
    window.setTimeout(() => setCopyStatus("Copy link"), 1600);
  }

  function downloadImage() {
    if (!renderer) return;

    const link = document.createElement("a");
    link.download = "create-a-pokeball.png";
    link.href = renderer.domElement.toDataURL("image/png");
    link.click();
    setExportStatus("Saved");
    window.setTimeout(() => setExportStatus("Download"), 1600);
  }

  return (
    <main
      className={`app-shell bg-gradient-to-br ${backdropClass[config.backdrop]}`}
    >
      <section className="stage-panel" aria-label="3D Pokeball preview">
        <div className="brand-bar">
          <button
            className={`icon-pill ${config.spin ? "active" : ""}`}
            onClick={() => updateConfig("spin", !config.spin)}
            type="button"
            title={config.spin ? "Pause rotation" : "Start rotation"}
          >
            <Rotate3d size={18} />
          </button>
        </div>
        <div className="canvas-wrap">
          <Scene config={config} onRendererReady={setRenderer} />
        </div>
      </section>

      <aside
        className="customizer-panel"
        aria-label="Pokeball customization options"
      >
        <div className="panel-heading">
          <div>
            <p className="eyebrow">PokeLab</p>
            <h2>Create a Pokeball!</h2>
          </div>
          <Sparkles size={21} />
        </div>

        <div className="panel-content">
          <ColorControl
            label="Top shell"
            value={config.topColor}
            onChange={(value) => updateConfig("topColor", value)}
          />
          <ColorControl
            label="Bottom shell"
            value={config.bottomColor}
            onChange={(value) => updateConfig("bottomColor", value)}
          />
          <ColorControl
            label="Center band"
            value={config.bandColor}
            onChange={(value) => updateConfig("bandColor", value)}
          />
          <ColorControl
            label="Button"
            value={config.buttonColor}
            onChange={(value) => updateConfig("buttonColor", value)}
          />
          <ColorControl
            label="Button highlight"
            value={config.buttonHighlightColor}
            onChange={(value) => updateConfig("buttonHighlightColor", value)}
          />

          <SegmentedControl
            label="Finish"
            value={config.finish}
            onChange={(value) => updateConfig("finish", value)}
            options={finishOptions}
          />

          {/* <SegmentedControl
            label="Pattern"
            value={config.pattern}
            onChange={updatePattern}
            options={patternOptions}
          />
          <ColorControl
            label="Pattern color"
            value={config.patternColor}
            onChange={(value) => updateConfig("patternColor", value)}
          /> */}

          <div className="control-block">
            <label className="section-label" htmlFor="lettering-text">
              Lettering
            </label>
            <input
              className="text-input"
              id="lettering-text"
              maxLength={letteringMaxLength}
              placeholder="Add text"
              type="text"
              value={config.letteringText}
              onChange={(event) =>
                updateConfig(
                  "letteringText",
                  event.target.value.slice(0, letteringMaxLength),
                )
              }
            />
          </div>
          <ColorControl
            label="Lettering color"
            value={config.letteringColor}
            onChange={(value) => updateConfig("letteringColor", value)}
          />

          <SegmentedControl
            label="Lighting"
            value={config.lighting}
            onChange={(value) => updateConfig("lighting", value)}
            options={lightingOptions}
          />

          <SegmentedControl
            label="Backdrop"
            value={config.backdrop}
            onChange={(value) => updateConfig("backdrop", value)}
            options={backdropOptions}
          />
        </div>

        <div className="action-grid">
          <button
            aria-label={copyStatus}
            className="primary-action"
            onClick={copyShareUrl}
            title={copyStatus}
            type="button"
          >
            <Share2 size={17} />
            <span className="action-label">{copyStatus}</span>
          </button>
          <button
            aria-label={exportStatus}
            className="secondary-action"
            onClick={downloadImage}
            title={exportStatus}
            type="button"
          >
            <Download size={17} />
            <span className="action-label">{exportStatus}</span>
          </button>
          <button
            aria-label="Reset classic design"
            className="secondary-action wide"
            onClick={() => setConfig(defaultConfig)}
            title="Reset classic design"
            type="button"
          >
            <RotateCcw size={17} />
            <span className="action-label">Reset classic design</span>
          </button>
        </div>
      </aside>
    </main>
  );
}
