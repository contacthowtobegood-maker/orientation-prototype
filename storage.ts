import type { Answers } from "./scoring";

const KEY = "orientation-v1-reponses";

/** sessionStorage uniquement : effacé à la fermeture de l'onglet, jamais envoyé à un serveur. */
export function lireReponses(): Answers {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Answers) : {};
  } catch {
    return {};
  }
}

export function ecrireReponses(a: Answers): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* stockage indisponible : le parcours fonctionne quand même en mémoire */
  }
}

export function effacerReponses(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* rien à faire */
  }
}
