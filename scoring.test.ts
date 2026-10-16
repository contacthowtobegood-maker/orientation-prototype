import { describe, expect, it } from "vitest";
import { ITEMS, orderedItems } from "@/data/items";
import { DOMAINES } from "@/data/domaines";
import type { Answer, Dim } from "@/data/types";
import { calculerProfil, classerDomaines, construireBilan, type Answers } from "@/lib/scoring";

/** Construit des réponses : "like" pour les dimensions listées (n cartes chacune), "dislike" pour le reste. */
function reponses(likes: Partial<Record<Dim, number>>): Answers {
  const a: Answers = {};
  const compte: Record<string, number> = {};
  for (const it of ITEMS) {
    compte[it.dim] = (compte[it.dim] ?? 0) + 1;
    const n = likes[it.dim] ?? 0;
    a[it.id] = (compte[it.dim] <= n ? "like" : "dislike") as Answer;
  }
  return a;
}

describe("banque d'items", () => {
  it("contient 6 items par dimension et des identifiants uniques", () => {
    expect(ITEMS).toHaveLength(36);
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(36);
    for (const d of ["R", "I", "A", "S", "E", "C"]) expect(ITEMS.filter((i) => i.dim === d)).toHaveLength(6);
  });
  it("garde des textes courts (140 caractères maximum)", () => {
    for (const i of ITEMS) expect(i.text.length).toBeLessThanOrEqual(140);
  });
  it("alterne les dimensions à la présentation", () => {
    const o = orderedItems();
    expect(o).toHaveLength(36);
    for (let k = 1; k < o.length; k++) expect(o[k].dim).not.toBe(o[k - 1].dim);
  });
});

describe("domaines", () => {
  it("couvre exactement 20 familles et 45 secteurs Onisep sans doublon", () => {
    expect(DOMAINES).toHaveLength(20);
    const secteurs = DOMAINES.flatMap((d) => d.onisepSecteurs);
    expect(secteurs).toHaveLength(45);
    expect(new Set(secteurs).size).toBe(45);
  });
});

describe("profil", () => {
  it("calcule la part de cartes aimées par dimension", () => {
    const p = calculerProfil(reponses({ I: 6, A: 3 }));
    expect(p.scores.I).toBe(1);
    expect(p.scores.A).toBe(0.5);
    expect(p.scores.R).toBe(0);
    expect(p.classement.slice(0, 2)).toEqual(["I", "A"]);
    expect(p.code).toBe("IAR");
  });
  it("refuse de produire un bilan avec trop peu de réponses", () => {
    const a: Answers = {};
    for (const it of ITEMS.slice(0, 10)) a[it.id] = "like";
    expect(calculerProfil(a).exploitable).toBe(false);
    expect(construireBilan(a)).toBeNull();
  });
  it("les cartes passées ne comptent pas comme des réponses", () => {
    const a = reponses({ S: 6 });
    for (const it of ITEMS.slice(0, 20)) a[it.id] = "skip";
    expect(calculerProfil(a).repondues).toBe(16);
  });
  it("signale un profil peu différencié (tout aimer ou tout rejeter)", () => {
    expect(calculerProfil(reponses({ R: 6, I: 6, A: 6, S: 6, E: 6, C: 6 })).differencie).toBe(false);
    expect(calculerProfil(reponses({})).differencie).toBe(false);
    const b = construireBilan(reponses({ R: 6, I: 6, A: 6, S: 6, E: 6, C: 6 }))!;
    expect(b.suggestions).toHaveLength(0);
  });
  it("signale les ex aequo", () => {
    expect(calculerProfil(reponses({ I: 5, A: 5, S: 5, R: 1 })).ex_aequo).toBe(true);
  });
});

describe("matching", () => {
  const cas: [string, Partial<Record<Dim, number>>, string][] = [
    ["profil mécanicien", { R: 6, I: 3, C: 3 }, "mecanique"],
    ["profil soignant", { S: 6, I: 3, R: 2 }, "paramedical"],
    ["profil créatif", { A: 6, E: 2, R: 2 }, "art"],
    ["profil informaticien", { I: 6, R: 2, C: 2 }, "numerique"],
    ["profil gestionnaire", { C: 6, E: 3, S: 2 }, "gestion"],
    ["profil commercial", { E: 6, S: 2, C: 2 }, "commerce"],
    ["profil enseignant", { S: 6, A: 2, E: 2 }, "social"],
  ];
  for (const [nom, likes, attendu] of cas) {
    it(`${nom} : le domaine attendu figure dans les 3 premiers`, () => {
      const p = calculerProfil(reponses(likes));
      const top3 = classerDomaines(p).slice(0, 3).map((s) => s.domaine.id);
      expect(top3).toContain(attendu);
    });
  }
  it("est déterministe", () => {
    const a = reponses({ I: 5, S: 4, A: 2 });
    expect(JSON.stringify(construireBilan(a))).toBe(JSON.stringify(construireBilan(a)));
  });
  it("ne renvoie jamais de pourcentage dans les textes d'explication", () => {
    const b = construireBilan(reponses({ I: 6, S: 4, R: 2 }))!;
    for (const s of [...b.suggestions, ...b.surprises, ...b.autres]) expect(s.explication).not.toMatch(/%|pour cent/);
  });
  it("accorde les profils au pluriel dans les explications", () => {
    const b = construireBilan(reponses({ I: 6, S: 4, R: 2 }))!;
    const txt = [...b.suggestions, ...b.surprises, ...b.autres].map((s) => s.explication).join(" ");
    expect(txt).toMatch(/profils (investigateurs|sociaux|réalistes)/);
    expect(txt).not.toMatch(/profils (investigateur|social|réaliste|artistique|entreprenant|conventionnel)(\s|\.|,)/);
  });
  it("chaque suggestion est expliquée et classée forte ou moyenne", () => {
    const b = construireBilan(reponses({ I: 6, S: 4, R: 2 }))!;
    expect(b.suggestions.length).toBeGreaterThan(0);
    for (const s of b.suggestions) {
      expect(s.explication.length).toBeGreaterThan(20);
      expect(["forte", "moyenne"]).toContain(s.niveau);
    }
  });
  it("aucun domaine n'est présenté deux fois dans le bilan", () => {
    const b = construireBilan(reponses({ E: 4, S: 4, A: 4 }))!;
    const ids = [...b.suggestions, ...b.surprises, ...b.autres].map((s) => s.domaine.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("les pistes inattendues sont hors du top 3", () => {
    const p = calculerProfil(reponses({ I: 6, S: 5, A: 2, R: 1 }));
    const b = construireBilan(reponses({ I: 6, S: 5, A: 2, R: 1 }))!;
    const top3 = classerDomaines(p).slice(0, 3).map((s) => s.domaine.id);
    for (const s of b.surprises) expect(top3).not.toContain(s.domaine.id);
  });
});
