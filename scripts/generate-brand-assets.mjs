#!/usr/bin/env node
/**
 * Génère les assets de marque « All In » (icônes + splash) en PNG.
 * Source de vérité : ce script + la police Outfit statique (assets/fonts).
 * Usage : node scripts/generate-brand-assets.mjs
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = path.join(root, "assets", "fonts");
const imagesDir = path.join(root, "assets", "images");

const FONT = "OutfitExtraBold";

const C = {
  ambreClair: "#F7B74A",
  ambreOr: "#EE8B33",
  bleuNuit: "#16265C",
  bleuHaut: "#1B2A5B",
  encre: "#101736",
  blanc: "#FFFFFF",
};

if (!GlobalFonts.registerFromPath(path.join(fontsDir, "Outfit-ExtraBold.ttf"), FONT)) {
  console.error("Impossible d'enregistrer Outfit-ExtraBold.ttf depuis", fontsDir);
  process.exit(1);
}
if (!GlobalFonts.registerFromPath(path.join(fontsDir, "Outfit-Regular.ttf"), "OutfitRegular")) {
  console.error("Impossible d'enregistrer Outfit-Regular.ttf depuis", fontsDir);
  process.exit(1);
}

// Sanity check : l'ExtraBold doit être plus large que le Regular.
{
  const ctx = createCanvas(10, 10).getContext("2d");
  ctx.font = "100px OutfitExtraBold";
  const bold = ctx.measureText("all in").width;
  ctx.font = "100px OutfitRegular";
  const regular = ctx.measureText("all in").width;
  console.log(`Sanity check : ExtraBold ${bold.toFixed(0)}px vs Regular ${regular.toFixed(0)}px de large pour "all in"`);
  if (bold <= regular) {
    console.error("ECHEC : l'ExtraBold ne rend pas plus large que le Regular.");
    process.exit(1);
  }
}

function canvasPng(w, h, draw) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  draw(ctx, w, h);
  return canvas.toBuffer("image/png");
}

// Icône : wordmark empilé sur dégradé bleu nuit (plein cadre, l'OS arrondit).
const drawIcon = (ctx) => {
  const g = ctx.createLinearGradient(0, 0, 0, 1024);
  g.addColorStop(0, C.bleuHaut);
  g.addColorStop(1, C.encre);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.font = "270px " + FONT;
  ctx.fillStyle = C.blanc;
  ctx.fillText("all", 512, 470);
  ctx.fillStyle = C.ambreClair;
  ctx.fillText("in", 512, 745);
};

// Variante tinted iOS : niveaux de gris, le système applique la teinte.
const drawTinted = (ctx) => {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.font = "270px " + FONT;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("all", 512, 470);
  ctx.fillText("in", 512, 745);
};

// Foreground Android adaptive icon : transparent, contenu dans la zone sûre (66%).
const drawAdaptive = (ctx) => {
  ctx.font = "185px " + FONT;
  ctx.fillStyle = C.blanc;
  ctx.fillText("all", 512, 469);
  ctx.fillStyle = C.ambreClair;
  ctx.fillText("in", 512, 689);
};

// Favicon : « in » seul sur bleu nuit.
const drawFavicon = (ctx) => {
  ctx.fillStyle = C.bleuNuit;
  ctx.fillRect(0, 0, 48, 48);
  ctx.font = "20px " + FONT;
  ctx.fillStyle = C.ambreClair;
  ctx.fillText("in", 24, 30);
};

// Splash : wordmark sur fond transparent (la couleur de fond vient de app.config.js).
const drawSplash = (cAll, cIn) => (ctx) => {
  ctx.textAlign = "left";
  ctx.font = "220px " + FONT;
  const wAll = ctx.measureText("all").width;
  const gap = 14;
  const wIn = ctx.measureText("in").width;
  const startX = 500 - (wAll + gap + wIn) / 2;
  ctx.fillStyle = cAll;
  ctx.fillText("all", startX, 210);
  ctx.fillStyle = cIn;
  ctx.fillText("in", startX + wAll + gap, 210);
};

async function render(w, h, draw, file, label) {
  const buf = canvasPng(w, h, draw);
  fs.writeFileSync(path.join(imagesDir, file), buf);
  console.log(`${label} -> assets/images/${file} (${w}x${h}, ${Math.round(buf.length / 1024)} Ko)`);
}

await render(1024, 1024, drawIcon, "icon.png", "Icône");
await render(1024, 1024, drawIcon, "ios-light.png", "Icône iOS light");
await render(1024, 1024, drawIcon, "ios-dark.png", "Icône iOS dark");
await render(1024, 1024, drawTinted, "ios-tinted.png", "Icône iOS tinted");
await render(1024, 1024, drawAdaptive, "adaptive-icon.png", "Adaptive icon (foreground)");
await render(48, 48, drawFavicon, "favicon.png", "Favicon");
await render(1000, 400, drawSplash(C.bleuNuit, C.blanc), "splash.png", "Splash light (fond #F7B74A via app.config.js)");
await render(1000, 400, drawSplash(C.blanc, C.ambreClair), "splash-dark.png", "Splash dark (fond #101736 via app.config.js)");
console.log("Assets générés.");
