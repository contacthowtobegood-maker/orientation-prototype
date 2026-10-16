import type { Dim } from "./types";

export interface DimInfo {
  dim: Dim;
  nom: string;
  /** Pluriel masculin, pour les phrases du type « des profils sociaux ». */
  pluriel: string;
  /** Verbe d'action utilisé dans les phrases d'explication. */
  gout: string;
  couleur: string;
  /** Pictogramme décoratif (toujours accompagné du nom). */
  picto: string;
}

/** Couleurs : palette Okabe-Ito (section 14 du méga prompt). Repères graphiques, jamais couleur de texte. */
export const DIM_INFO: Record<Dim, DimInfo> = {
  R: { dim: "R", nom: "Réaliste", pluriel: "Réalistes", gout: "agir concrètement, manipuler, construire", couleur: "#D55E00", picto: "🔧" },
  I: { dim: "I", nom: "Investigateur", pluriel: "Investigateurs", gout: "comprendre, analyser, chercher", couleur: "#0072B2", picto: "🔍" },
  A: { dim: "A", nom: "Artistique", pluriel: "Artistiques", gout: "créer, imaginer, t'exprimer", couleur: "#CC79A7", picto: "🎨" },
  S: { dim: "S", nom: "Social", pluriel: "Sociaux", gout: "aider, accompagner, transmettre", couleur: "#009E73", picto: "🤝" },
  E: { dim: "E", nom: "Entreprenant", pluriel: "Entreprenants", gout: "convaincre, diriger, lancer des projets", couleur: "#E69F00", picto: "🚀" },
  C: { dim: "C", nom: "Conventionnel", pluriel: "Conventionnels", gout: "organiser, fiabiliser, structurer", couleur: "#56B4E9", picto: "🗂️" },
};
