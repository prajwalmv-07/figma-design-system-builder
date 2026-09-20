# Design System, Typography & Component Library — Figma Build Guide

## 0. Fastest way to finish (≈10 minutes, desktop Figma)
1. Figma desktop app → **New design file** → rename it (see §1).
2. Menu → **Plugins → Development → Import plugin from manifest…** → pick `figma-ds-plugin/manifest.json`.
3. Run **Design System Builder**. It creates all 10 pages, color/text/effect styles, Variables (color, spacing, radius, sizes), and every component with variants + Auto Layout.
4. Open page **10 Documentation**, select the frame **Design System Frame** → right-click → **Copy link to selection**.
5. **Share** (top right) → *Anyone with the link* → **can view** → paste that link into the task's *Submit deliverable*.
6. Before submitting: replace `Author: <your name>` on the Cover page, and skim every page (checklist §7).

> The script is untested inside your Figma account. If Figma shows an error, tell me the exact message and I'll fix it. Figma Variables may be limited on free plans — the script then still creates all styles.

---

## 1. File name
**`Rapido Academy — Design System & Component Library v1.0`**
(Short alternative: `DS-Core — Typography & Components`)

## 2. Page names
| # | Page |
|---|------|
| 1 | 01 Cover / Overview |
| 2 | 02 Foundations |
| 3 | 03 Colors |
| 4 | 04 Typography |
| 5 | 05 Spacing & Design Tokens |
| 6 | 06 Buttons |
| 7 | 07 Inputs |
| 8 | 08 Cards |
| 9 | 09 Navigation & Badges |
| 10 | 10 Documentation |

## 3. Component naming (Slash = folder in Assets panel)
| Component set | Layer names inside |
|---|---|
| `Button` | `Label` |
| `Input` | `Label`, `Field`, `Value`, `Helper` |
| `Card` | `Image`, `Body`, `Title`, `Description`, `Actions` |
| `Badge` | `Dot`, `Label` |
| `Menu Item` | `Label` |
| `Navigation Bar` | `Logo`, `Flex Spacer`, `Tab Home` … |
| `Icon/Placeholder` | `Glyph` |

Rules: PascalCase-with-spaces component names, no abbreviations, one component set per element, states as **variants** (never separate components), layer names describe role (`Label`, `Helper`), never “Frame 123”.

## 4. Variant / property names (exact)
| Component | Property | Values |
|---|---|---|
| Button | `Type` | Primary, Secondary, Outline, Ghost |
| | `State` | Default, Hover, Pressed, Disabled |
| | `Size` | Small (32), Medium (40), Large (48) |
| | `Label` (text) | “Button” |
| Input | `State` | Default, Focus, Filled, Error, Disabled |
| | `Label` | On, Off |
| | `Helper` | On, Off |
| | `Label text` (text) | “Label” |
| Card | `Type` | Basic, Image, Information, Action |
| Badge | `Type` | Success, Warning, Error, Info, Neutral |
| Menu Item | `State` | Inactive, Hover, Active |
| Navigation Bar | `Type` | Desktop, Mobile |
| Icon/Placeholder | `Size` | 16, 20, 24, 32 |

Variant string example: `Type=Primary, State=Hover, Size=Medium`

## 5. Design tokens

**Spacing** `space/4 · 8 · 12 · 16 · 24 · 32 · 40 · 48`
**Radius** `none 0 · sm 4 · md 8 · lg 12 · xl 16 · full 9999`
**Shadows** SM `0 1 2 8%` · MD `0 4 8 −2 12%` · LG `0 12 24 −4 16%` · Focus `0 0 0 3 Primary/600 30%`
**Sizes** control-sm 32 · control-md 40 · control-lg 48 · input-height 48 · icon 16/20/24 · nav-height 64

**Colors (styles named `Group/Step`)**

| Group | Values |
|---|---|
| Primary | 50 #EEF2FF · 100 #E0E7FF · 200 #C7D2FE · 300 #A5B4FC · 600 #4F46E5 · 700 #3730A3 · 800 #312E81 · 900 #1E1B4B |
| Secondary | 50 #F0FDFA · 100 #CCFBF1 · 200 #99F6E4 · 700 #0F766E · 800 #115E59 · 900 #134E4A |
| Neutral | 50 #F8FAFC · 100 #F1F5F9 · 200 #E2E8F0 · 300 #CBD5E1 · 400 #94A3B8 · 500 #64748B · 600 #475569 · 700 #334155 · 800 #1E293B · 900 #0F172A |
| Success | Base #166534 · Subtle #DCFCE7 · Text #14532D |
| Warning | Base #B45309 · Subtle #FEF3C7 · Text #713F12 |
| Error | Base #991B1B · Subtle #FEE2E2 · Text #7F1D1D |
| Info | Base #1E40AF · Subtle #DBEAFE · Text #1E3A8A |
| Background | Page #F8FAFC · Default #FFFFFF |
| Surface | Default #FFFFFF · Muted #F1F5F9 · Inverse #0F172A |
| Text | Primary #0F172A · Secondary #334155 · Muted #475569 · Inverse #FFFFFF · Link #3730A3 · Disabled #64748B |
| Border | Subtle #E2E8F0 · Input #64748B |

**Verified WCAG contrast (calculated)** — AAA = 7:1

| Pair | Ratio |
|---|---|
| Text/Primary on Surface | 17.85 |
| Text/Secondary on Surface | 10.35 |
| Text/Muted on Surface / Page | 7.58 / 7.24 |
| Text/Link on Surface | 9.93 |
| White on Primary 700 / 800 / 900 | 9.93 / 11.42 / 15.99 |
| Primary 900 on Primary 100 | 12.98 |
| Secondary 900 on Secondary 100 / 200 | 8.41 / 7.52 |
| Success / Warning / Error / Info Text on Subtle | 8.30 / 7.79 / 8.20 / 8.49 |
| Neutral 800 on Neutral 100 | 13.35 |
| Border/Input on white (non-text, needs 3:1) | 4.76 |

Exceptions: `Text/Disabled` on disabled fills (exempt by WCAG for inactive controls). Don't use `Text/Muted` on `Surface/Muted` (6.92:1 — AA only).

**Typography — Inter**

| Style | Weight | Size / Line height | Letter spacing |
|---|---|---|---|
| Heading/H1 | Bold 700 | 40 / 48 | −2% |
| Heading/H2 | Bold 700 | 32 / 40 | −1.5% |
| Heading/H3 | Semi Bold 600 | 24 / 32 | −1% |
| Heading/H4 | Semi Bold 600 | 20 / 28 | 0 |
| Body/Large | Regular 400 | 18 / 28 | 0 |
| Body/Regular | Regular 400 | 16 / 24 | 0 |
| Body/Small | Regular 400 | 14 / 20 | 0 |
| Utility/Button Text | Semi Bold 600 | 16 / 24 | 0 |
| Utility/Label | Medium 500 | 14 / 20 | 0 |
| Utility/Caption | Regular 400 | 12 / 16 | +2% |

## 6. Atomic structure
- **Foundations** – colors, type, spacing, radius, shadows (styles + Variables)
- **Icons** – `Icon/Placeholder`
- **Atoms** – Button, Input, Badge, Icon, Menu Item
- **Molecules** – Form field (Label + Input + Helper), Card actions (button group), Nav bar row
- **Components** – Card (4 types), Navigation Bar (Desktop/Mobile)
- **Patterns** – Sign-in form, card grid, page header (documented composition; not separate screens)
- **Documentation** – `Design System Frame` on page 10

## 7. Final checklist
**Colors**
- [ ] Primary, Secondary, Neutral, Success, Warning, Error, Info, Background, Surface, Text styles exist (Assets → Local styles)
- [ ] Contrast table visible on Colors page; body text pairs ≥ 7:1

**Typography**
- [ ] 10 text styles: H1–H4, Body L/R/S, Button Text, Label, Caption
- [ ] Each shows family, size, weight, line height, letter spacing

**Components (all use Auto Layout + variants)**
- [ ] Button: Primary, Secondary, Outline, Ghost × Default, Hover, Pressed, Disabled
- [ ] Input: Default, Focus, Filled, Error, Disabled, with label, with helper/error text
- [ ] Card: Basic, Image, Information, Action
- [ ] Navigation: Navigation Bar, Menu Item, Active/Inactive, Mobile bar
- [ ] Badge: Success, Warning, Error, Info, Neutral

**Structure & tokens**
- [ ] 10 pages named exactly as in §2, in order
- [ ] Spacing 4/8/12/16/24/32/40/48 on page 5 + Variables (`space/*`, `radius/*`, `size/*`, `color/*`)
- [ ] Radius, shadows, component sizes defined
- [ ] Components are named per §3–4; no “Frame 123” layers

**Documentation**
- [ ] Purpose, palette, type scale, spacing, component usage, states, atomic structure — all on `Design System Frame`
- [ ] Author name replaced on Cover

**Submission**
- [ ] File shared as *Anyone with the link → can view*
- [ ] Link copied via *Copy link to selection* on the Documentation frame
- [ ] Link opens in a private/incognito window

## 8. Polish ideas (optional, if you have time)
Replace `Icon/Placeholder` with a real icon set; add a dark-mode variable mode; add a “Sign-in form” pattern built only from your components.
