#!/usr/bin/env node
/**
 * render-overlay.js — Bridge between video-use and Remotion
 *
 * Usage (called by video-use or manually):
 *   node scripts/render-overlay.js --composition OverlayHorizontal --props '{"subtitles":{...}}' --out out/overlay.webm
 *
 * video-use then composites with ffmpeg:
 *   ffmpeg -i footage.mp4 -i overlay.webm -filter_complex "[0][1]overlay=0:0" final.mp4
 */

const { execSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
}

const composition = getArg("composition") ?? "OverlayHorizontal";
const props = getArg("props") ?? "{}";
const out = getArg("out") ?? `out/overlay-${Date.now()}.webm`;
const fps = getArg("fps") ?? "30";
const frames = getArg("frames") ?? null;

const root = path.resolve(__dirname, "..");
const outPath = path.isAbsolute(out) ? out : path.join(root, out);

const cmd = [
  "npx remotion render",
  composition,
  `"${outPath}"`,
  `--props='${props}'`,
  frames ? `--frames=${frames}` : "",
  `--image-format=png`,
  `--codec=vp8`,
].filter(Boolean).join(" ");

console.log(`[render-overlay] ${cmd}`);
execSync(cmd, { cwd: root, stdio: "inherit" });
console.log(`[render-overlay] Done → ${outPath}`);
