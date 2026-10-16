import type { Item } from "./types";

/**
 * Banque d'items PROVISOIRE (6 par dimension RIASEC), rédigée spécifiquement pour ce projet.
 * Aucun item d'un test publié n'est repris. À faire relire et valider par des psychologues
 * (clarté, niveau de lecture, biais de genre) avant toute mise en production.
 */
export const ITEMS: Item[] = [
  // R : Réaliste (faire, manipuler, construire, être dehors)
  { id: "R1", dim: "R", text: "Réparer un objet cassé plutôt que le jeter." },
  { id: "R2", dim: "R", text: "Passer la journée dehors à travailler de mes mains." },
  { id: "R3", dim: "R", text: "Monter un meuble ou une étagère sans notice." },
  { id: "R4", dim: "R", text: "Comprendre comment fonctionne une machine en la démontant." },
  { id: "R5", dim: "R", text: "Cultiver des plantes ou m'occuper d'animaux." },
  { id: "R6", dim: "R", text: "Conduire ou piloter un engin, de la moto au tracteur." },

  // I : Investigateur (comprendre, analyser, chercher)
  { id: "I1", dim: "I", text: "Chercher pourquoi un phénomène se produit, jusqu'à trouver la réponse." },
  { id: "I2", dim: "I", text: "Faire une expérience pour vérifier une idée." },
  { id: "I3", dim: "I", text: "Résoudre une énigme ou un problème de logique qui résiste." },
  { id: "I4", dim: "I", text: "Lire des articles qui expliquent comment le corps ou l'espace fonctionnent." },
  { id: "I5", dim: "I", text: "Analyser des chiffres pour y repérer une tendance." },
  { id: "I6", dim: "I", text: "Comparer plusieurs sources avant de me faire une opinion." },

  // A : Artistique (créer, imaginer, s'exprimer)
  { id: "A1", dim: "A", text: "Inventer une histoire, une chanson ou un personnage." },
  { id: "A2", dim: "A", text: "Décorer un espace pour lui donner une ambiance." },
  { id: "A3", dim: "A", text: "Dessiner, photographier ou filmer ce que je vois." },
  { id: "A4", dim: "A", text: "Monter sur scène pour jouer, chanter ou raconter." },
  { id: "A5", dim: "A", text: "Imaginer le design d'un objet ou d'un vêtement." },
  { id: "A6", dim: "A", text: "Travailler sans consigne précise pour laisser de la place à mes idées." },

  // S : Social (aider, enseigner, accompagner)
  { id: "S1", dim: "S", text: "Expliquer quelque chose à quelqu'un jusqu'à ce qu'il comprenne." },
  { id: "S2", dim: "S", text: "Écouter un ami qui traverse une période difficile." },
  { id: "S3", dim: "S", text: "Aider des enfants ou des plus jeunes à progresser." },
  { id: "S4", dim: "S", text: "Organiser une action pour aider les autres." },
  { id: "S5", dim: "S", text: "Prendre soin d'une personne malade ou fragile." },
  { id: "S6", dim: "S", text: "Faciliter un groupe pour que chacun trouve sa place." },

  // E : Entreprenant (convaincre, diriger, lancer)
  { id: "E1", dim: "E", text: "Convaincre un groupe de suivre mon idée." },
  { id: "E2", dim: "E", text: "Lancer un projet ou une petite activité à moi." },
  { id: "E3", dim: "E", text: "Négocier un prix ou un accord." },
  { id: "E4", dim: "E", text: "Prendre la tête d'une équipe quand il faut décider vite." },
  { id: "E5", dim: "E", text: "Vendre un objet ou une idée et réussir à toucher mon public." },
  { id: "E6", dim: "E", text: "Prendre un risque calculé pour gagner quelque chose d'important." },

  // C : Conventionnel (organiser, ranger, fiabiliser)
  { id: "C1", dim: "C", text: "Ranger, classer et nommer des fichiers pour que tout soit retrouvable." },
  { id: "C2", dim: "C", text: "Tenir des comptes ou un budget à jour, au centime près." },
  { id: "C3", dim: "C", text: "Suivre une procédure claire pour que le résultat soit toujours le même." },
  { id: "C4", dim: "C", text: "Relire un document pour repérer la moindre erreur." },
  { id: "C5", dim: "C", text: "Planifier un événement avec un tableau, des horaires et des listes." },
  { id: "C6", dim: "C", text: "Travailler dans un cadre où les règles sont connues d'avance." },
];

/** Ordre de présentation : alterne les dimensions pour éviter l'effet de série. */
export function orderedItems(): Item[] {
  const byDim = new Map<string, Item[]>();
  for (const it of ITEMS) {
    const list = byDim.get(it.dim) ?? [];
    list.push(it);
    byDim.set(it.dim, list);
  }
  const out: Item[] = [];
  for (let i = 0; i < 6; i++) {
    for (const d of ["R", "I", "A", "S", "E", "C"]) {
      const it = byDim.get(d)?.[i];
      if (it) out.push(it);
    }
  }
  return out;
}
