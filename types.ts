export type Dim = "R" | "I" | "A" | "S" | "E" | "C";
export const DIMS: Dim[] = ["R", "I", "A", "S", "E", "C"];

export type Answer = "like" | "dislike" | "skip";

export interface Item {
  id: string;
  dim: Dim;
  /** Phrase affichée sur la carte (140 caractères maximum). */
  text: string;
}

export interface Domaine {
  id: string;
  label: string;
  /** Secteurs Onisep regroupés (libellés relevés sur onisep.fr, à rapprocher de la nomenclature Idéo officielle). */
  onisepSecteurs: string[];
  /** Poids RIASEC de 0 à 3 : 3 = dimension centrale du domaine. */
  weights: Partial<Record<Dim, number>>;
  /** Exemples de métiers à titre d'illustration ; le lien Idéo-Métiers viendra de l'API Onisep. */
  exemples: string[];
}

export type Niveau = "forte" | "moyenne" | "faible";
