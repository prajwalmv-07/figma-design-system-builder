// Design System Builder — run in a NEW, BLANK Figma design file (desktop app).
// Plugins > Development > Import plugin from manifest... > select manifest.json > Run.
const FONT = "Inter";
const hex2rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });

// ---------- TOKENS ----------
const COLORS = {
  "Primary/50": "#EEF2FF", "Primary/100": "#E0E7FF", "Primary/200": "#C7D2FE", "Primary/300": "#A5B4FC",
  "Primary/600": "#4F46E5", "Primary/700": "#3730A3", "Primary/800": "#312E81", "Primary/900": "#1E1B4B",
  "Secondary/50": "#F0FDFA", "Secondary/100": "#CCFBF1", "Secondary/200": "#99F6E4",
  "Secondary/700": "#0F766E", "Secondary/800": "#115E59", "Secondary/900": "#134E4A",
  "Neutral/50": "#F8FAFC", "Neutral/100": "#F1F5F9", "Neutral/200": "#E2E8F0", "Neutral/300": "#CBD5E1", "Neutral/400": "#94A3B8",
  "Neutral/500": "#64748B", "Neutral/600": "#475569", "Neutral/700": "#334155", "Neutral/800": "#1E293B", "Neutral/900": "#0F172A",
  "Success/Base": "#166534", "Success/Subtle": "#DCFCE7", "Success/Text": "#14532D",
  "Warning/Base": "#B45309", "Warning/Subtle": "#FEF3C7", "Warning/Text": "#713F12",
  "Error/Base": "#991B1B", "Error/Subtle": "#FEE2E2", "Error/Text": "#7F1D1D",
  "Info/Base": "#1E40AF", "Info/Subtle": "#DBEAFE", "Info/Text": "#1E3A8A",
  "Background/Page": "#F8FAFC", "Background/Default": "#FFFFFF",
  "Surface/Default": "#FFFFFF", "Surface/Muted": "#F1F5F9", "Surface/Inverse": "#0F172A",
  "Text/Primary": "#0F172A", "Text/Secondary": "#334155", "Text/Muted": "#475569", "Text/Inverse": "#FFFFFF", "Text/Link": "#3730A3", "Text/Disabled": "#64748B",
  "Border/Subtle": "#E2E8F0", "Border/Input": "#64748B",
};
const GROUPS = ["Primary", "Secondary", "Neutral", "Success", "Warning", "Error", "Info", "Background", "Surface", "Text", "Border"];
// [name, weight, size, lineHeight, letterSpacing %, sample]
const TYPE = [
  ["Heading/H1", "Bold", 40, 48, -2, "Design that scales"],
  ["Heading/H2", "Bold", 32, 40, -1.5, "Design that scales"],
  ["Heading/H3", "Semi Bold", 24, 32, -1, "Design that scales"],
  ["Heading/H4", "Semi Bold", 20, 28, 0, "Design that scales"],
  ["Body/Large", "Regular", 18, 28, 0, "Body Large — introductory and lead paragraphs."],
  ["Body/Regular", "Regular", 16, 24, 0, "Body Regular — default paragraph text."],
  ["Body/Small", "Regular", 14, 20, 0, "Body Small — secondary and dense content."],
  ["Utility/Button Text", "Semi Bold", 16, 24, 0, "Button Text"],
  ["Utility/Label", "Medium", 14, 20, 0, "Label"],
  ["Utility/Caption", "Regular", 12, 16, 2, "Caption — helper text and metadata."],
];
const SPACE = [4, 8, 12, 16, 24, 32, 40, 48];
const RADIUS = { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };
const SIZES = { "control-sm": 32, "control-md": 40, "control-lg": 48, "input-height": 48, "icon-sm": 16, "icon-md": 20, "icon-lg": 24, "nav-height": 64 };
const SHADOWS = {
  "Shadow/SM": [{ y: 1, r: 2, s: 0, a: 0.08 }],
  "Shadow/MD": [{ y: 4, r: 8, s: -2, a: 0.12 }],
  "Shadow/LG": [{ y: 12, r: 24, s: -4, a: 0.16 }],
  "Shadow/Focus": [{ y: 0, r: 0, s: 3, a: 0.3, c: "#4F46E5" }],
};
const PAIRS = [
  ["Text/Primary", "Surface/Default", "17.85"], ["Text/Secondary", "Surface/Default", "10.35"], ["Text/Muted", "Surface/Default", "7.58"],
  ["Text/Muted", "Background/Page", "7.24"], ["Text/Link", "Surface/Default", "9.93"],
  ["Text/Inverse", "Primary/700", "9.93"], ["Text/Inverse", "Primary/800", "11.42"], ["Text/Inverse", "Primary/900", "15.99"],
  ["Primary/900", "Primary/100", "12.98"], ["Primary/700", "Primary/50", "8.88"],
  ["Secondary/900", "Secondary/100", "8.41"], ["Secondary/900", "Secondary/200", "7.52"],
  ["Success/Text", "Success/Subtle", "8.30"], ["Warning/Text", "Warning/Subtle", "7.79"],
  ["Error/Text", "Error/Subtle", "8.20"], ["Info/Text", "Info/Subtle", "8.49"], ["Neutral/800", "Neutral/100", "13.35"],
];

const S = { paint: {}, text: {}, effect: {} };
const VAR = {};
const BTN = {}, INP = {}, CARD = {}, BADGE = {}, NAVITEM = {}, ICON = {};

// ---------- HELPERS ----------
const paint = (n, c) => n.setFillStyleIdAsync(S.paint[c].id);
async function stroke(n, c, w = 1) { await n.setStrokeStyleIdAsync(S.paint[c].id); n.strokeWeight = w; n.strokeAlign = "INSIDE"; }
const effect = (n, e) => n.setEffectStyleIdAsync(S.effect[e].id);

function bindTokens(f, gap, pad, radius) {
  try {
    const b = (field, val) => { const v = VAR["space/" + val]; if (v) f.setBoundVariable(field, v); };
    b("itemSpacing", gap); b("paddingTop", pad[0]); b("paddingRight", pad[1]); b("paddingBottom", pad[2]); b("paddingLeft", pad[3]);
    const r = Object.entries(RADIUS).find(([, x]) => x === radius && x > 0);
    if (r) ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach((fd) => f.setBoundVariable(fd, VAR["radius/" + r[0]]));
  } catch (e) { console.log("bind skipped", e); }
}

function setup(f, o = {}) {
  const { dir = "VERTICAL", gap = 0, pad = [0, 0, 0, 0], w = null, h = null, align = "MIN", cross = "MIN", radius = 0, wrap = false, clip = false } = o;
  f.fills = [];
  f.layoutMode = dir;
  f.itemSpacing = gap;
  f.paddingTop = pad[0]; f.paddingRight = pad[1]; f.paddingBottom = pad[2]; f.paddingLeft = pad[3];
  f.primaryAxisAlignItems = align; f.counterAxisAlignItems = cross;
  f.cornerRadius = radius; f.clipsContent = clip;
  if (w || h) f.resize(w || f.width, h || f.height);
  const hM = w ? "FIXED" : "AUTO", vM = h ? "FIXED" : "AUTO";
  if (dir === "HORIZONTAL") { f.primaryAxisSizingMode = hM; f.counterAxisSizingMode = vM; }
  else { f.primaryAxisSizingMode = vM; f.counterAxisSizingMode = hM; }
  if (wrap) { f.layoutWrap = "WRAP"; f.counterAxisSpacing = gap; }
  bindTokens(f, gap, pad, radius);
  return f;
}
const frame = (name, o, parent) => { const f = setup(figma.createFrame(), o); f.name = name; if (parent) parent.appendChild(f); return f; };
const row = (parent, gap = 16, name = "Row") => frame(name, { dir: "HORIZONTAL", gap, w: 1200, wrap: true }, parent);

async function text(chars, style, color, parent, name, fill = false) {
  const t = figma.createText();
  t.fontName = { family: FONT, style: "Regular" };
  t.characters = chars;
  await t.setTextStyleIdAsync(S.text[style].id);
  await paint(t, color);
  if (name) t.name = name;
  if (parent) { parent.appendChild(t); if (fill) t.layoutSizingHorizontal = "FILL"; }
  return t;
}
async function rect(w, h, color, parent, radius = 0) {
  const r = figma.createRectangle(); r.resize(w, h); r.cornerRadius = radius; await paint(r, color); if (parent) parent.appendChild(r); return r;
}
async function dot(size, color, parent) {
  const e = figma.createEllipse(); e.resize(size, size); await paint(e, color); if (parent) parent.appendChild(e); return e;
}
function grid(set, cols, gap = 24, pad = 24) {
  let x = pad, y = pad, rowH = 0, c = 0, maxX = 0;
  for (const k of set.children) {
    if (c === cols) { c = 0; x = pad; y += rowH + gap; rowH = 0; }
    k.x = x; k.y = y; x += k.width + gap; rowH = Math.max(rowH, k.height); maxX = Math.max(maxX, x); c++;
  }
  set.resizeWithoutConstraints(Math.max(maxX - gap + pad, 100), y + rowH + pad);
}
function textProp(set, prop, def, nodeName) {
  try {
    const key = set.addComponentProperty(prop, "TEXT", def);
    set.findAll((n) => n.type === "TEXT" && n.name === nodeName).forEach((t) => { t.componentPropertyReferences = { characters: key }; });
  } catch (e) { console.log("textProp skipped", e); }
}
function setLabel(inst, val) {
  try {
    const k = Object.keys(inst.componentProperties).find((k) => k.startsWith("Label"));
    if (k) { inst.setProperties({ [k]: val }); return; }
  } catch (e) { /* fall through */ }
  const t = inst.findOne((n) => n.type === "TEXT"); if (t) t.characters = val;
}
async function pageFrame(page, title, sub, width = 1360) {
  await figma.setCurrentPageAsync(page);
  const f = frame(title, { gap: 48, pad: [80, 80, 80, 80], w: width }, page);
  await paint(f, "Background/Page");
  const head = frame("Header", { gap: 8 }, f);
  await text(title, "Heading/H1", "Text/Primary", head, "Title");
  await text(sub, "Body/Large", "Text/Secondary", head, "Subtitle");
  return f;
}
async function note(parent, chars) { const t = await text(chars, "Body/Small", "Text/Muted", parent, "Note"); return t; }

// ---------- STYLES & VARIABLES ----------
async function createStyles() {
  for (const [n, h] of Object.entries(COLORS)) {
    const s = figma.createPaintStyle(); s.name = n; s.paints = [{ type: "SOLID", color: hex2rgb(h) }]; S.paint[n] = s;
  }
  for (const [n, w, size, lh, ls] of TYPE) {
    const s = figma.createTextStyle(); s.name = n; s.fontName = { family: FONT, style: w }; s.fontSize = size;
    s.lineHeight = { value: lh, unit: "PIXELS" }; s.letterSpacing = { value: ls, unit: "PERCENT" }; S.text[n] = s;
  }
  for (const [n, layers] of Object.entries(SHADOWS)) {
    const s = figma.createEffectStyle(); s.name = n;
    s.effects = layers.map((l) => ({ type: "DROP_SHADOW", color: { ...hex2rgb(l.c || "#0F172A"), a: l.a }, offset: { x: 0, y: l.y }, radius: l.r, spread: l.s, visible: true, blendMode: "NORMAL" }));
    S.effect[n] = s;
  }
}
function createVariables() {
  const col = figma.variables.createVariableCollection("Design Tokens");
  const mode = col.modes[0].modeId; col.renameMode(mode, "Light");
  const mk = (name, type, val) => { const v = figma.variables.createVariable(name, col, type); v.setValueForMode(mode, val); VAR[name] = v; };
  for (const [n, h] of Object.entries(COLORS)) mk("color/" + n.toLowerCase(), "COLOR", hex2rgb(h));
  for (const s of SPACE) mk("space/" + s, "FLOAT", s);
  for (const [k, v] of Object.entries(RADIUS)) mk("radius/" + k, "FLOAT", v);
  for (const [k, v] of Object.entries(SIZES)) mk("size/" + k, "FLOAT", v);
}

// ---------- REUSABLE SECTIONS ----------
async function swatches(parent) {
  const wrap = frame("Color Palette", { gap: 40 }, parent);
  for (const g of GROUPS) {
    const sec = frame(g, { gap: 16 }, wrap);
    await text(g, "Heading/H4", "Text/Primary", sec, "Group");
    const r = row(sec, 16, "Swatches");
    for (const name of Object.keys(COLORS).filter((n) => n.startsWith(g + "/"))) {
      const item = frame(name, { gap: 4 }, r);
      if (g === "Text") {
        const box = frame("Sample", { dir: "HORIZONTAL", w: 112, h: 64, align: "CENTER", cross: "CENTER", radius: 8 }, item);
        await paint(box, "Surface/Default"); await stroke(box, "Border/Subtle");
        await text("Aa", "Heading/H3", name, box, "Aa");
      } else {
        const sw = await rect(112, 64, name, item, 8); await stroke(sw, "Border/Subtle");
      }
      await text(name.split("/")[1], "Utility/Label", "Text/Primary", item, "Name");
      await text(COLORS[name], "Utility/Caption", "Text/Muted", item, "Hex");
    }
  }
  return wrap;
}
async function contrastTable(parent) {
  const wrap = frame("Contrast Pairs (WCAG AAA ≥ 7:1)", { gap: 12 }, parent);
  await text("Contrast pairs — WCAG AAA needs ≥ 7:1 for body text", "Heading/H4", "Text/Primary", wrap, "Title");
  const r = row(wrap, 12, "Pairs");
  for (const [fg, bg, ratio] of PAIRS) {
    const chip = frame(`${fg} on ${bg}`, { dir: "HORIZONTAL", gap: 12, pad: [12, 16, 12, 16], w: 290, cross: "CENTER", radius: 8 }, r);
    await paint(chip, bg); await stroke(chip, "Border/Subtle");
    await text("Aa", "Heading/H4", fg, chip, "Aa");
    const col = frame("Meta", { gap: 0 }, chip);
    await text(`${ratio}:1  AAA`, "Utility/Label", fg, col, "Ratio");
    await text(`${fg} / ${bg}`, "Utility/Caption", fg, col, "Pair");
  }
  await note(wrap, "Text/Disabled is exempt from WCAG contrast (inactive UI). Border/Input on Surface = 4.76:1 (non-text requirement is 3:1). Use Text/Muted only on Surface/Default or Background/Page.");
  return wrap;
}
async function typeScale(parent) {
  const wrap = frame("Typography Scale", { gap: 24 }, parent);
  for (const [name, w, size, lh, ls, sample] of TYPE) {
    const r = frame(name, { dir: "HORIZONTAL", gap: 32, w: 1200, cross: "CENTER" }, wrap);
    const spec = frame("Spec", { gap: 2, w: 280 }, r);
    await text(name, "Utility/Label", "Text/Primary", spec, "Style name");
    await text(`Inter ${w} · ${size}px / ${lh}px · ${ls}%`, "Utility/Caption", "Text/Muted", spec, "Spec");
    await text(sample, name, "Text/Primary", r, "Sample");
  }
  return wrap;
}
async function spacingBlock(parent) {
  const wrap = frame("Spacing & Tokens", { gap: 48 }, parent);
  const sp = frame("Spacing", { gap: 12 }, wrap);
  await text("Spacing scale", "Heading/H4", "Text/Primary", sp);
  for (const s of SPACE) {
    const r = frame("space/" + s, { dir: "HORIZONTAL", gap: 16, cross: "CENTER" }, sp);
    const l = frame("Label", { w: 120 }, r); await text(`space/${s}  ·  ${s}px`, "Utility/Label", "Text/Primary", l);
    await rect(s * 4, 16, "Primary/600", r, 4);
  }
  const rd = frame("Radius", { gap: 12 }, wrap);
  await text("Border radius", "Heading/H4", "Text/Primary", rd);
  const rr = row(rd, 24);
  for (const [k, v] of Object.entries(RADIUS)) {
    const it = frame("radius/" + k, { gap: 8 }, rr);
    const b = await rect(96, 96, "Primary/100", it, Math.min(v, 48)); await stroke(b, "Primary/700");
    await text(`radius/${k} · ${v === 9999 ? "9999" : v}px`, "Utility/Caption", "Text/Secondary", it);
  }
  const sh = frame("Shadows", { gap: 12 }, wrap);
  await text("Shadows", "Heading/H4", "Text/Primary", sh);
  const sr = row(sh, 32);
  for (const k of Object.keys(SHADOWS)) {
    const it = frame(k, { gap: 12 }, sr);
    const b = await rect(140, 88, "Surface/Default", it, 12); await effect(b, k);
    await text(k, "Utility/Caption", "Text/Secondary", it);
  }
  const sz = frame("Component sizes", { gap: 8 }, wrap);
  await text("Component size tokens", "Heading/H4", "Text/Primary", sz);
  await text(Object.entries(SIZES).map(([k, v]) => `size/${k} = ${v}px`).join("\n"), "Body/Small", "Text/Secondary", sz);
  return wrap;
}

// ---------- COMPONENTS ----------
async function buildIcons(host) {
  const comps = [];
  for (const s of [16, 20, 24, 32]) {
    const c = figma.createComponent(); c.name = `Size=${s}`;
    setup(c, { dir: "HORIZONTAL", w: s, h: s, align: "CENTER", cross: "CENTER" });
    const e = figma.createEllipse(); e.resize(Math.round(s * 0.7), Math.round(s * 0.7)); e.fills = []; e.name = "Glyph";
    await stroke(e, "Neutral/700", 2); c.appendChild(e); ICON[s] = c; comps.push(c);
  }
  const set = figma.combineAsVariants(comps, host); set.name = "Icon/Placeholder"; grid(set, 4);
  return set;
}
async function buildButtons(host) {
  const T = {
    Primary: { Default: ["Primary/700", null, "Text/Inverse"], Hover: ["Primary/800", null, "Text/Inverse"], Pressed: ["Primary/900", null, "Text/Inverse"], Disabled: ["Neutral/200", null, "Text/Disabled"] },
    Secondary: { Default: ["Secondary/100", null, "Secondary/900"], Hover: ["Secondary/200", null, "Secondary/900"], Pressed: ["Secondary/200", "Secondary/800", "Secondary/900"], Disabled: ["Neutral/200", null, "Text/Disabled"] },
    Outline: { Default: ["Surface/Default", "Primary/700", "Primary/700"], Hover: ["Primary/50", "Primary/700", "Primary/700"], Pressed: ["Primary/100", "Primary/800", "Primary/800"], Disabled: ["Surface/Default", "Neutral/300", "Text/Disabled"] },
    Ghost: { Default: [null, null, "Primary/700"], Hover: ["Primary/50", null, "Primary/700"], Pressed: ["Primary/100", null, "Primary/800"], Disabled: [null, null, "Text/Disabled"] },
  };
  const SZ = { Small: { h: 32, px: 12 }, Medium: { h: 40, px: 16 }, Large: { h: 48, px: 24 } };
  const comps = [];
  for (const size of Object.keys(SZ)) for (const type of Object.keys(T)) for (const state of Object.keys(T[type])) {
    const [bg, st, fg] = T[type][state];
    const c = figma.createComponent(); c.name = `Type=${type}, State=${state}, Size=${size}`;
    setup(c, { dir: "HORIZONTAL", gap: 8, pad: [0, SZ[size].px, 0, SZ[size].px], h: SZ[size].h, align: "CENTER", cross: "CENTER", radius: 8 });
    if (bg) await paint(c, bg);
    if (st) await stroke(c, st, state === "Pressed" ? 2 : 1);
    await text("Button", "Utility/Button Text", fg, c, "Label");
    BTN[c.name] = c; comps.push(c);
  }
  const set = figma.combineAsVariants(comps, host); set.name = "Button"; grid(set, 4);
  textProp(set, "Label", "Button", "Label");
  return set;
}
async function buildInputs(host) {
  const comps = [];
  for (const state of ["Default", "Focus", "Filled", "Error", "Disabled"]) for (const label of ["On", "Off"]) for (const helper of ["On", "Off"]) {
    const c = figma.createComponent(); c.name = `State=${state}, Label=${label}, Helper=${helper}`;
    setup(c, { gap: 4, w: 320 });
    const dis = state === "Disabled";
    if (label === "On") await text("Label", "Utility/Label", dis ? "Text/Disabled" : "Text/Primary", c, "Label", true);
    const field = frame("Field", { dir: "HORIZONTAL", gap: 8, pad: [12, 16, 12, 16], h: 48, cross: "CENTER", radius: 8 }, c);
    field.layoutSizingHorizontal = "FILL";
    await paint(field, dis ? "Neutral/100" : "Surface/Default");
    if (state === "Focus") { await stroke(field, "Primary/600", 2); await effect(field, "Shadow/Focus"); }
    else if (state === "Error") await stroke(field, "Error/Base", 2);
    else if (dis) await stroke(field, "Neutral/300", 1);
    else await stroke(field, "Border/Input", 1);
    const val = state === "Default" ? ["Placeholder", "Text/Muted"] : dis ? ["Disabled", "Text/Disabled"] : ["Input value", "Text/Primary"];
    await text(val[0], "Body/Regular", val[1], field, "Value", true);
    if (helper === "On") {
      const err = state === "Error";
      await text(err ? "Error message" : "Helper text", "Utility/Caption", err ? "Error/Text" : dis ? "Text/Disabled" : "Text/Muted", c, "Helper", true);
    }
    INP[c.name] = c; comps.push(c);
  }
  const set = figma.combineAsVariants(comps, host); set.name = "Input"; grid(set, 4);
  textProp(set, "Label text", "Label", "Label");
  return set;
}
async function buildBadges(host) {
  const M = { Success: "Success", Warning: "Warning", Error: "Error", Info: "Info" };
  const comps = [];
  for (const type of ["Success", "Warning", "Error", "Info", "Neutral"]) {
    const c = figma.createComponent(); c.name = `Type=${type}`;
    setup(c, { dir: "HORIZONTAL", gap: 8, pad: [4, 12, 4, 12], cross: "CENTER", radius: 9999 });
    const n = type === "Neutral";
    await paint(c, n ? "Neutral/100" : `${M[type]}/Subtle`);
    const d = await dot(8, n ? "Neutral/500" : `${M[type]}/Base`, c); d.name = "Dot";
    await text(type, "Utility/Label", n ? "Neutral/800" : `${M[type]}/Text`, c, "Label");
    BADGE[c.name] = c; comps.push(c);
  }
  const set = figma.combineAsVariants(comps, host); set.name = "Badge"; grid(set, 5);
  return set;
}
async function buildCards(host) {
  const comps = [];
  for (const type of ["Basic", "Image", "Information", "Action"]) {
    const c = figma.createComponent(); c.name = `Type=${type}`;
    setup(c, { w: 320, radius: 12, clip: true });
    const info = type === "Information";
    await paint(c, info ? "Info/Subtle" : "Surface/Default");
    await stroke(c, info ? "Info/Base" : "Border/Subtle");
    if (!info) await effect(c, "Shadow/SM");
    if (type === "Image") { const img = await rect(320, 160, "Neutral/200", c); img.name = "Image"; }
    const body = frame("Body", { gap: 8, pad: [16, 16, 16, 16] }, c); body.layoutSizingHorizontal = "FILL";
    const tc = info ? "Info/Text" : "Text/Primary", bc = info ? "Info/Text" : "Text/Secondary";
    if (info) body.appendChild(ICON[24].createInstance());
    await text(info ? "Information title" : type === "Action" ? "Action card" : "Card title", "Heading/H4", tc, body, "Title", true);
    await text("Supporting description text that explains the card content.", "Body/Small", bc, body, "Description", true);
    if (type === "Action") {
      const r = frame("Actions", { dir: "HORIZONTAL", gap: 8, pad: [8, 0, 0, 0] }, body);
      const a = BTN["Type=Primary, State=Default, Size=Small"].createInstance(); r.appendChild(a); setLabel(a, "Confirm");
      const b = BTN["Type=Ghost, State=Default, Size=Small"].createInstance(); r.appendChild(b); setLabel(b, "Cancel");
    }
    CARD[c.name] = c; comps.push(c);
  }
  const set = figma.combineAsVariants(comps, host); set.name = "Card"; grid(set, 4);
  return set;
}
async function buildNav(host) {
  const items = [];
  for (const state of ["Inactive", "Hover", "Active"]) {
    const c = figma.createComponent(); c.name = `State=${state}`;
    setup(c, { dir: "HORIZONTAL", gap: 8, pad: [0, 16, 0, 16], h: 40, align: "CENTER", cross: "CENTER", radius: 8 });
    if (state === "Hover") await paint(c, "Neutral/100");
    if (state === "Active") await paint(c, "Primary/100");
    await text("Menu item", "Utility/Label", state === "Active" ? "Primary/900" : state === "Hover" ? "Text/Primary" : "Text/Secondary", c, "Label");
    NAVITEM[c.name] = c; items.push(c);
  }
  const itemSet = figma.combineAsVariants(items, host); itemSet.name = "Menu Item"; grid(itemSet, 3);
  textProp(itemSet, "Label", "Menu item", "Label");

  const bars = [];
  const desk = figma.createComponent(); desk.name = "Type=Desktop";
  setup(desk, { dir: "HORIZONTAL", gap: 8, pad: [12, 24, 12, 24], w: 1024, h: 64, cross: "CENTER" });
  await paint(desk, "Surface/Default"); await stroke(desk, "Border/Subtle");
  await text("Brand", "Heading/H4", "Primary/700", desk, "Logo");
  ["Home", "Products", "About"].forEach((l, i) => {
    const it = NAVITEM[i === 0 ? "State=Active" : "State=Inactive"].createInstance(); desk.appendChild(it); setLabel(it, l);
  });
  const sp = figma.createFrame(); sp.name = "Flex Spacer"; sp.fills = []; sp.resize(1, 1); desk.appendChild(sp); sp.layoutGrow = 1;
  const cta = BTN["Type=Primary, State=Default, Size=Small"].createInstance(); desk.appendChild(cta); setLabel(cta, "Sign up");
  bars.push(desk);

  const mob = figma.createComponent(); mob.name = "Type=Mobile";
  setup(mob, { dir: "HORIZONTAL", pad: [8, 16, 8, 16], w: 375, h: 64, align: "SPACE_BETWEEN", cross: "CENTER" });
  await paint(mob, "Surface/Default"); await stroke(mob, "Border/Subtle");
  for (const [i, l] of ["Home", "Search", "Saved", "Profile"].entries()) {
    const tab = frame("Tab " + l, { gap: 4, cross: "CENTER", pad: [4, 12, 4, 12] }, mob);
    tab.appendChild(ICON[24].createInstance());
    await text(l, "Utility/Caption", i === 0 ? "Primary/700" : "Text/Secondary", tab, "Label");
  }
  bars.push(mob);
  const barSet = figma.combineAsVariants(bars, host); barSet.name = "Navigation Bar"; grid(barSet, 1);
  return { itemSet, barSet };
}

async function componentsShowcase(parent) {
  const wrap = frame("Component States", { gap: 32 }, parent);
  const h = async (t) => text(t, "Heading/H4", "Text/Primary", wrap);
  await h("Buttons — Type × State");
  for (const type of ["Primary", "Secondary", "Outline", "Ghost"]) {
    const r = row(wrap, 16);
    for (const st of ["Default", "Hover", "Pressed", "Disabled"]) { const i = BTN[`Type=${type}, State=${st}, Size=Medium`].createInstance(); r.appendChild(i); setLabel(i, `${type} · ${st}`); }
  }
  await h("Inputs — State (with label + helper/error text)");
  const ri = row(wrap, 24);
  for (const st of ["Default", "Focus", "Filled", "Error", "Disabled"]) ri.appendChild(INP[`State=${st}, Label=On, Helper=On`].createInstance());
  await h("Cards — Type");
  const rc = row(wrap, 24);
  for (const t of ["Basic", "Image", "Information", "Action"]) rc.appendChild(CARD["Type=" + t].createInstance());
  await h("Badges — Type");
  const rb = row(wrap, 16);
  for (const t of ["Success", "Warning", "Error", "Info", "Neutral"]) rb.appendChild(BADGE["Type=" + t].createInstance());
  await h("Navigation — Menu Item states, Desktop & Mobile bars");
  const rn = row(wrap, 16);
  for (const s of ["Inactive", "Hover", "Active"]) rn.appendChild(NAVITEM["State=" + s].createInstance());
  return wrap;
}

// ---------- MAIN ----------
async function main() {
  await Promise.all(["Regular", "Medium", "Semi Bold", "Bold"].map((s) => figma.loadFontAsync({ family: FONT, style: s })));
  try { createVariables(); } catch (e) { console.log("Variables skipped", e); figma.notify("Variables skipped (plan limit?) — styles still created."); }
  await createStyles();

  const NAMES = ["01 Cover / Overview", "02 Foundations", "03 Colors", "04 Typography", "05 Spacing & Design Tokens", "06 Buttons", "07 Inputs", "08 Cards", "09 Navigation & Badges", "10 Documentation"];
  const P = {};
  NAMES.forEach((n, i) => { const p = i === 0 ? figma.currentPage : figma.createPage(); p.name = n; P[i + 1] = p; });

  // 02 Foundations
  let f = await pageFrame(P[2], "Foundations", "Principles, icon set and the token model that everything else is built on.");
  const pr = frame("Principles", { gap: 8 }, f);
  await text("Principles", "Heading/H3", "Text/Primary", pr);
  await text("• Accessible first: all body text meets WCAG AAA (7:1).\n• Consistent: one spacing scale (4-8-12-16-24-32-40-48), one radius scale, three shadows.\n• Reusable: every element is a component with variants and Auto Layout.\n• Token-driven: colors, spacing, radius and sizes exist as Figma Variables + Styles.", "Body/Regular", "Text/Secondary", pr);
  const ic = frame("Icons", { gap: 16 }, f);
  await text("Icons", "Heading/H3", "Text/Primary", ic);
  await buildIcons(ic);
  await note(ic, "Placeholder icon component in 4 sizes (16/20/24/32). Swap the glyph with your icon library (e.g. Lucide or Material Symbols) — instances update everywhere.");

  // 03 Colors
  f = await pageFrame(P[3], "Colors", "Global color styles: Primary, Secondary, Neutral, Success, Warning, Error, Info, Background, Surface, Text, Border.");
  await swatches(f); await contrastTable(f);

  // 04 Typography
  f = await pageFrame(P[4], "Typography", "Inter — modern sans-serif. Sizes in px, line-height in px, letter-spacing in %.");
  await typeScale(f);

  // 05 Spacing
  f = await pageFrame(P[5], "Spacing & Design Tokens", "Spacing, radius, shadow and component-size tokens (also stored as Figma Variables in “Design Tokens”).");
  await spacingBlock(f);

  // 06 Buttons
  f = await pageFrame(P[6], "Buttons", "Primary, Secondary, Outline, Ghost × Default, Hover, Pressed, Disabled × Small, Medium, Large.");
  await buildButtons(f);
  await note(f, "Properties: Type = Primary | Secondary | Outline | Ghost   ·   State = Default | Hover | Pressed | Disabled   ·   Size = Small | Medium | Large   ·   Text: Label");

  // 07 Inputs
  f = await pageFrame(P[7], "Inputs", "Default, Focus, Filled, Error, Disabled — each with optional label and helper/error text.");
  await buildInputs(f);
  await note(f, "Properties: State = Default | Focus | Filled | Error | Disabled   ·   Label = On | Off   ·   Helper = On | Off   ·   Text: Label text");

  // 08 Cards
  f = await pageFrame(P[8], "Cards", "Basic, Image, Information and Action cards. The Action card nests Button instances.");
  await buildCards(f);
  await note(f, "Properties: Type = Basic | Image | Information | Action");

  // 09 Navigation & Badges
  f = await pageFrame(P[9], "Navigation & Badges", "Menu Item (Inactive / Hover / Active), Navigation Bar (Desktop / Mobile) and status Badges.");
  await buildBadges(f);
  await buildNav(f);
  await note(f, "Badge: Type = Success | Warning | Error | Info | Neutral   ·   Menu Item: State = Inactive | Hover | Active   ·   Navigation Bar: Type = Desktop | Mobile");

  // 10 Documentation
  const d = await pageFrame(P[10], "Design System — Documentation", "A scalable, accessible, token-driven design system and component library built with atomic design principles.");
  d.name = "Design System Frame";
  const sec = async (title, body) => {
    const s = frame(title, { gap: 24, w: 1200 }, d);
    await text(title, "Heading/H2", "Text/Primary", s, "Section title");
    if (body) await text(body, "Body/Regular", "Text/Secondary", s, "Body", true);
    return s;
  };
  await sec("1. Purpose", "This system gives designers and developers one source of truth for color, type, spacing and components. It keeps interfaces consistent, speeds up design, meets WCAG AAA contrast for text, and scales by composing small parts (atoms) into larger ones (molecules, components, patterns).");
  await swatches(await sec("2. Color palette", "Semantic, accessible palette. Always choose colors by role (e.g. Text/Primary, Surface/Default), not by hex."));
  await typeScale(await sec("3. Typography scale", "Inter across the product. Ten styles cover headings, body copy, controls and metadata."));
  await spacingBlock(await sec("4. Spacing system & tokens", "Use only these values for padding, gaps and sizing. Radius, shadows and control sizes are tokenized too."));
  await componentsShowcase(await sec("5. Components & states", "Every component is built with Auto Layout and exposes variants. Swap variants in the right-hand Properties panel; edit text via the Label property."));
  await sec("6. Component usage", "Buttons: one Primary per view; Secondary/Outline for supporting actions; Ghost for low-emphasis. Inputs: always pair with a Label; use Error state with an explanatory message. Cards: pick the type by content — Basic, Image, Information (feedback), Action (with buttons). Badges: status only, never as buttons. Navigation: exactly one Active Menu Item; use the Mobile bar below 768px.");
  await sec("7. Atomic design structure", "Foundations → Colors, Typography, Spacing, Radius, Shadows (styles + variables)\nIcons → Icon/Placeholder\nAtoms → Button, Input, Badge, Icon, Menu Item\nMolecules → Form field (Label + Input + Helper), Card actions (Button group), Nav bar row\nComponents → Card (4 types), Navigation Bar (Desktop / Mobile)\nPatterns → Sign-in form, Card grid, Page header (composed from the above)\nDocumentation → this frame");

  // 01 Cover
  await figma.setCurrentPageAsync(P[1]);
  const cv = frame("Cover", { gap: 24, pad: [96, 96, 96, 96], w: 1440, h: 900, align: "CENTER" }, P[1]);
  await paint(cv, "Primary/900");
  await text("UI / UX DESIGN · INTERNSHIP TASK 05", "Utility/Label", "Primary/200", cv, "Eyebrow");
  await text("Design System", "Heading/H1", "Text/Inverse", cv, "Title");
  await text("Typography & Component Library", "Heading/H3", "Text/Inverse", cv, "Subtitle");
  await text("Atomic design · WCAG AAA colors · Auto Layout components · Design tokens", "Body/Large", "Primary/200", cv, "Tagline");
  const dots = frame("Palette dots", { dir: "HORIZONTAL", gap: 12 }, cv);
  for (const c of ["Primary/300", "Secondary/200", "Success/Subtle", "Warning/Subtle", "Error/Subtle", "Info/Subtle", "Neutral/100"]) await dot(32, c, dots);
  await text("Author: <your name>   ·   Version 1.0   ·   Inter", "Body/Small", "Primary/200", cv, "Meta");
  const idx = frame("Page index", { gap: 4, pad: [24, 0, 0, 0] }, cv);
  await text("Pages: " + NAMES.slice(1).join("  ·  "), "Body/Small", "Primary/200", idx, "Index");

  await figma.setCurrentPageAsync(P[10]);
  figma.viewport.scrollAndZoomIntoView(P[10].children);
  figma.notify("Design system built ✔  — now copy the link to the 'Design System Frame' on page 10.");
}

main().then(() => figma.closePlugin()).catch((e) => { console.error(e); figma.notify("Error: " + e.message, { error: true }); figma.closePlugin(); });
