#!/usr/bin/env node
/**
 * Réduit et découpe les PNG d'icônes d'events (assets/icons) :
 * 1. resize 512px (affichage max 144dp, EventIcon size="xl" = w-36)
 * 2. suppression du fond blanc par flood-fill depuis les bords
 *    (les blancs intérieurs de l'illustration sont préservés)
 * 3. érosion 1px + adoucissement de l'alpha + décontamination des franges
 * 4. quantisation palette
 * Les originaux restent dans l'historique git.
 * Usage : node scripts/optimize-event-icons.mjs
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = path.join(root, "assets", "icons");

const FILES = [
  "game_event_icon.png",
  "meal_event_icon.png",
  "party_event_icon.png",
  "restaurant_event_icon.png",
  "sport_event_icon.png",
  "transport_event_icon.png",
  "excursion_event_icon.png",
  "other_event_icon.png",
];

const SIZE = 512;
/** Seuil « blanc » (0-255) : au-dessus, considéré comme fond. */
const WHITE_THRESHOLD = 235;

const formatBytes = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
    : `${Math.round(bytes / 1024)} Ko`;

/**
 * Flood-fill depuis les bords : mask[i] = 0 (fond) / 1 (sujet).
 * Ne touche que le blanc connecté aux bords de l'image.
 */
const buildMask = (rgba, width, height) => {
  const mask = new Uint8Array(width * height).fill(1);
  const isBg = (i) =>
    rgba[i * 4] >= WHITE_THRESHOLD &&
    rgba[i * 4 + 1] >= WHITE_THRESHOLD &&
    rgba[i * 4 + 2] >= WHITE_THRESHOLD;

  const stack = [];
  const push = (x, y) => {
    const i = y * width + x;
    if (mask[i] && isBg(i)) {
      mask[i] = 0;
      stack.push(i);
    }
  };
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) push(x - 1, y);
    if (x < width - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < height - 1) push(x, y + 1);
  }
  return mask;
};

/** Érode le sujet de 1px (supprime la frange claire de l'anti-aliasing). */
const erode = (mask, width, height) => {
  const out = Uint8Array.from(mask);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (!mask[i]) continue;
      if (
        x === 0 || y === 0 || x === width - 1 || y === height - 1 ||
        !mask[i - 1] || !mask[i + 1] || !mask[i - width] || !mask[i + width]
      )
        out[i] = 0;
    }
  }
  return out;
};

/** Box blur 3x3 sur le masque -> alpha adouci (bords nets mais pas escaliers). */
const featherAlpha = (mask, width, height) => {
  const alpha = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          sum += mask[ny * width + nx];
          count++;
        }
      }
      alpha[y * width + x] = Math.round((sum / count) * 255);
    }
  }
  return alpha;
};

let before = 0;
let after = 0;

for (const file of FILES) {
  const target = path.join(iconsDir, file);
  const input = fs.readFileSync(target);

  const { data, info } = await sharp(input)
    .resize(SIZE, SIZE, { fit: "inside", withoutEnlargement: true, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const mask = erode(buildMask(data, info.width, info.height), info.width, info.height);
  const alpha = featherAlpha(mask, info.width, info.height);

  // Décontamination : un pixel semi-transparent avait un fond blanc mélangé,
  // on « dé-mélange » : c = (c - (1-a) * blanc) / a.
  for (let i = 0; i < info.width * info.height; i++) {
    const a = alpha[i] / 255;
    data[i * 4 + 3] = alpha[i];
    if (a > 0 && a < 1) {
      for (let c = 0; c < 3; c++) {
        data[i * 4 + c] = Math.max(0, Math.min(255, Math.round((data[i * 4 + c] - (1 - a) * 255) / a)));
      }
    }
  }

  const output = await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ palette: true, quality: 90, effort: 10 })
    .toBuffer();

  fs.writeFileSync(target, output);
  before += input.length;
  after += output.length;
  console.log(
    `${file}: ${formatBytes(input.length)} -> ${formatBytes(output.length)} ` +
    `(fond blanc supprimé, ${Math.round((output.length / input.length) * 100)}%)`,
  );
}

console.log(`Total: ${formatBytes(before)} -> ${formatBytes(after)} (-${Math.round((1 - after / before) * 100)}%)`);
