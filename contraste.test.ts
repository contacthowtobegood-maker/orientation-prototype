import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DIM_INFO } from "@/data/dims";

const css = readFileSync("app/globals.css", "utf8");

function token(nom: string, bloc: "light" | "dark" = "light"): string {
  // Le bloc sombre est celui de @media (prefers-color-scheme: dark)
  const source = bloc === "dark" ? css.slice(css.indexOf("prefers-color-scheme: dark")) : css.slice(0, css.indexOf("@media"));
  const m = source.match(new RegExp(`--${nom}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --${nom} introuvable (${bloc})`);
  return m[1];
}

function lum(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const CLAIR: [string, string, string, number][] = [
  ["texte sur fond", "nuit", "creme", 4.5],
  ["texte sur carte", "nuit", "carte", 4.5],
  ["texte secondaire sur fond", "gris", "creme", 4.5],
  ["texte secondaire sur carte", "gris", "carte", 4.5],
  ["lien indigo sur fond", "indigo", "creme", 4.5],
  ["lien indigo sur carte", "indigo", "carte", 4.5],
  ["bouton primaire", "indigo", "#ffffff", 4.5],
  ["bouton primaire survol", "indigo-survol", "#ffffff", 4.5],
  ["bouton j'aime (corail, texte nuit)", "corail", "nuit", 4.5],
  ["badge jaune, texte nuit", "jaune", "nuit", 4.5],
  ["menthe (texte nuit)", "menthe", "nuit", 4.5],
  ["vert profond sur fond", "vert", "creme", 4.5],
  ["erreur sur fond", "erreur", "creme", 4.5],
  ["encart attention", "attention", "nuit", 4.5],
];

describe("contrastes du thème clair (WCAG 2.x)", () => {
  for (const [nom, a, b, min] of CLAIR) {
    it(`${nom} ≥ ${min}`, () => {
      const ha = a.startsWith("#") ? a : token(a);
      const hb = b.startsWith("#") ? b : token(b);
      expect(ratio(ha, hb)).toBeGreaterThanOrEqual(min);
    });
  }
});

describe("contrastes du thème sombre", () => {
  const paires: [string, string, string][] = [
    ["texte", "texte", "fond"],
    ["texte sur surface", "texte", "surface"],
    ["texte secondaire", "texte-2", "fond"],
    ["texte secondaire sur surface", "texte-2", "surface"],
    ["accent", "accent", "fond"],
    ["texte du bouton primaire", "accent-texte", "accent"],
  ];
  for (const [nom, a, b] of paires) {
    it(`${nom} ≥ 4,5`, () => {
      expect(ratio(token(a, "dark"), token(b, "dark"))).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe("couleurs RIASEC (éléments graphiques)", () => {
  it("chaque pastille est lisible avec son contour nuit (clair) et son contour crème (sombre)", () => {
    for (const info of Object.values(DIM_INFO)) {
      expect(ratio(token("nuit"), token("creme"))).toBeGreaterThanOrEqual(3);
      expect(ratio(info.couleur, token("fond", "dark"))).toBeGreaterThanOrEqual(3);
    }
  });
  it("la lettre nuit sur chaque pastille reste lisible (≥ 3 pour une lettre en gras de grande taille)", () => {
    // Mesuré en phase d'étude : nuit sur I (#0072B2) = 3,08, le minimum de la série.
    for (const info of Object.values(DIM_INFO)) expect(ratio("#14213d", info.couleur)).toBeGreaterThanOrEqual(3);
  });
  it("les six couleurs sont toutes différentes", () => {
    expect(new Set(Object.values(DIM_INFO).map((i) => i.couleur)).size).toBe(6);
  });
});
