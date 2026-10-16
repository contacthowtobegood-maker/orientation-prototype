import { DIMS, type Answer, type Dim, type Domaine, type Item, type Niveau } from "@/data/types";
import { DIM_INFO } from "@/data/dims";
import { DOMAINES } from "@/data/domaines";
import { ITEMS } from "@/data/items";

/**
 * Moteur de profilage et de matching : 100 % déterministe, sans IA, sans pourcentage affiché.
 * Les seuils ci-dessous sont PROVISOIRES et à calibrer sur des profils réels validés.
 */

export type Answers = Record<string, Answer>;

export const SEUIL_PROFIL_EXPLOITABLE = 24; // réponses (hors "passer") minimum pour produire un bilan
export const ECART_MIN_DIFFERENCIATION = 2 / 6; // écart entre dimension max et min sous lequel le profil est jugé peu différencié
export const SEUIL_FORTE = 0.6;
export const SEUIL_MOYENNE = 0.3;

export interface Profil {
  /** Part des cartes aimées dans chaque dimension, de 0 à 1. */
  scores: Record<Dim, number>;
  repondues: number;
  total: number;
  /** Jauge de stabilité : esquisse, se précise, solide. */
  stabilite: "esquisse" | "se precise" | "solide";
  exploitable: boolean;
  differencie: boolean;
  /** Dimensions triées de la plus marquée à la moins marquée ; les ex aequo sont signalés dans `ex_aequo`. */
  classement: Dim[];
  ex_aequo: boolean;
  /** Code à trois lettres, ou moins si le profil n'est pas assez différencié. */
  code: string;
}

export interface Suggestion {
  domaine: Domaine;
  niveau: Niveau;
  /** Similarité interne [-1, 1] ; jamais affichée à l'utilisateur. */
  score: number;
  explication: string;
}

export interface Bilan {
  profil: Profil;
  suggestions: Suggestion[];
  /** Pistes inattendues, expliquées comme telles. */
  surprises: Suggestion[];
  /** Autres domaines d'affinité au moins moyenne, non déjà montrés. */
  autres: Suggestion[];
}

function itemsParDim(items: Item[]): Record<Dim, number> {
  const n = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } as Record<Dim, number>;
  for (const it of items) n[it.dim]++;
  return n;
}

export function calculerProfil(answers: Answers, items: Item[] = ITEMS): Profil {
  const nbParDim = itemsParDim(items);
  const likes = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } as Record<Dim, number>;
  let repondues = 0;
  for (const it of items) {
    const a = answers[it.id];
    if (a === "like" || a === "dislike") repondues++;
    if (a === "like") likes[it.dim]++;
  }
  const scores = {} as Record<Dim, number>;
  for (const d of DIMS) scores[d] = nbParDim[d] ? likes[d] / nbParDim[d] : 0;

  const ordre = [...DIMS].sort((a, b) => scores[b] - scores[a] || DIMS.indexOf(a) - DIMS.indexOf(b));
  const max = scores[ordre[0]];
  const min = scores[ordre[ordre.length - 1]];
  const differencie = max - min >= ECART_MIN_DIFFERENCIATION - 1e-9;
  const exploitable = repondues >= SEUIL_PROFIL_EXPLOITABLE;

  // Ex aequo à la frontière du top 3 : le code est alors présenté comme non tranché.
  const ex_aequo = scores[ordre[2]] === scores[ordre[3]] || scores[ordre[0]] === scores[ordre[1]] || scores[ordre[1]] === scores[ordre[2]];

  const part = repondues / items.length;
  const stabilite = part >= 0.9 ? "solide" : part >= 0.67 ? "se precise" : "esquisse";

  return {
    scores,
    repondues,
    total: items.length,
    stabilite,
    exploitable,
    differencie,
    classement: ordre,
    ex_aequo,
    code: differencie ? ordre.slice(0, 3).join("") : "",
  };
}

function centrer(v: number[]): number[] {
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  return v.map((x) => x - m);
}

function cosinus(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / Math.sqrt(na * nb);
}

export function niveauDepuisScore(score: number): Niveau {
  if (score >= SEUIL_FORTE) return "forte";
  if (score >= SEUIL_MOYENNE) return "moyenne";
  return "faible";
}

function joindre(noms: string[]): string {
  if (noms.length <= 1) return noms[0] ?? "";
  return noms.slice(0, -1).join(", ") + " et " + noms[noms.length - 1];
}

function dimsDuDomaine(d: Domaine): Dim[] {
  return DIMS.filter((x) => (d.weights[x] ?? 0) >= 2).sort((a, b) => (d.weights[b] ?? 0) - (d.weights[a] ?? 0) || DIMS.indexOf(a) - DIMS.indexOf(b));
}

function expliquer(profil: Profil, d: Domaine, niveau: Niveau): string {
  const dominantes = dimsDuDomaine(d);
  const top = profil.classement.slice(0, 3);
  const communes = dominantes.filter((x) => top.includes(x));
  const nomsDomaine = joindre(dominantes.map((x) => DIM_INFO[x].pluriel.toLowerCase()));
  if (communes.length > 0) {
    const gouts = communes.map((x) => DIM_INFO[x].gout).join(", mais aussi pour ");
    return `Ce domaine fait surtout appel à des profils ${nomsDomaine}. Tu as montré du goût pour ${gouts} : c'est ce qui le rapproche de toi.`;
  }
  return `Ce domaine fait surtout appel à des profils ${nomsDomaine}, qui ne font pas partie de tes trois goûts les plus marqués : l'affinité reste ${niveau === "faible" ? "limitée" : "partielle"}.`;
}

export function classerDomaines(profil: Profil, domaines: Domaine[] = DOMAINES): Suggestion[] {
  const p = centrer(DIMS.map((d) => profil.scores[d]));
  const res = domaines.map((dom) => {
    const w = centrer(DIMS.map((d) => dom.weights[d] ?? 0));
    const score = cosinus(p, w);
    const niveau = niveauDepuisScore(score);
    return { domaine: dom, niveau, score, explication: expliquer(profil, dom, niveau) };
  });
  // Tri stable : à score égal, l'ordre alphabétique évite tout biais de position.
  return res.sort((a, b) => b.score - a.score || a.domaine.label.localeCompare(b.domaine.label, "fr"));
}

/**
 * Pistes inattendues : domaines hors du top 3, d'affinité au moins moyenne, dont la dimension centrale
 * n'est pas dans les deux goûts principaux de la personne mais dont une dimension secondaire l'est.
 */
export function pistesInattendues(profil: Profil, classement: Suggestion[]): Suggestion[] {
  const top2 = profil.classement.slice(0, 2);
  const horsTop = classement.slice(3).filter((s) => s.niveau !== "faible");
  const out: Suggestion[] = [];
  for (const s of horsTop) {
    const dominantes = dimsDuDomaine(s.domaine);
    if (dominantes.length === 0) continue;
    const centrale = dominantes[0];
    const secondaires = DIMS.filter((x) => (s.domaine.weights[x] ?? 0) >= 1 && x !== centrale);
    if (!top2.includes(centrale) && secondaires.some((x) => top2.includes(x))) {
      const commun = secondaires.find((x) => top2.includes(x))!;
      out.push({
        ...s,
        explication: `Piste inattendue : ce domaine tourne autour de profils ${DIM_INFO[centrale].pluriel.toLowerCase()}, mais il laisse aussi de la place à ton goût pour ${DIM_INFO[commun].gout}. Ça vaut le coup d'y jeter un œil.`,
      });
    }
    if (out.length === 2) break;
  }
  return out;
}

export function construireBilan(answers: Answers): Bilan | null {
  const profil = calculerProfil(answers);
  if (!profil.exploitable) return null;
  if (!profil.differencie) return { profil, suggestions: [], surprises: [], autres: [] };
  const classement = classerDomaines(profil);
  const suggestions = classement.filter((s) => s.niveau !== "faible").slice(0, 3);
  const surprises = pistesInattendues(profil, classement).filter((s) => !suggestions.some((x) => x.domaine.id === s.domaine.id));
  const montres = new Set([...suggestions, ...surprises].map((s) => s.domaine.id));
  const autres = classement.filter((s) => s.niveau !== "faible" && !montres.has(s.domaine.id)).slice(0, 3);
  return { profil, suggestions, surprises, autres };
}
