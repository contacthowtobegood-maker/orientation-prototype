import type { Domaine } from "./types";

/**
 * 20 familles de domaines : regroupement PROVISOIRE des 45 secteurs affichés sur
 * onisep.fr ("Des métiers par secteur"). Les poids RIASEC sont des hypothèses de travail
 * rédigées pour le prototype : ils doivent être remplacés par une matrice validée par des
 * psychologues et conseillers d'orientation, puis rapprochée de la nomenclature Idéo officielle
 * (20 domaines, 132 sous-domaines) une fois le fichier data.gouv.fr récupéré.
 * Version de la matrice : v0-provisoire.
 */
export const MATRICE_VERSION = "v0-provisoire";

export const DOMAINES: Domaine[] = [
  {
    id: "agri",
    label: "Agriculture, alimentation et environnement",
    onisepSecteurs: ["Agriculture", "Agroéquipement", "Industrie alimentaire", "Environnement Développement durable", "Filière bois"],
    weights: { R: 3, I: 2, E: 1 },
    exemples: ["Agriculteur", "Technicien en environnement", "Ingénieur agronome"],
  },
  {
    id: "batiment",
    label: "Architecture, bâtiment et travaux publics",
    onisepSecteurs: ["Architecture, urbanisme, paysage", "Bâtiment et travaux publics (BTP)"],
    weights: { R: 3, A: 1, E: 1, C: 1 },
    exemples: ["Architecte", "Conducteur de travaux", "Maçon"],
  },
  {
    id: "art",
    label: "Art, design et artisanat d'art",
    onisepSecteurs: ["Art et design", "Artisanat d'art"],
    weights: { A: 3, R: 2, E: 1 },
    exemples: ["Designer", "Ébéniste", "Céramiste"],
  },
  {
    id: "spectacle",
    label: "Spectacle, audiovisuel et jeu vidéo",
    onisepSecteurs: ["Arts du spectacle", "Audiovisuel", "Jeu vidéo"],
    weights: { A: 3, E: 1, I: 1 },
    exemples: ["Réalisateur", "Technicien son", "Game designer"],
  },
  {
    id: "culture",
    label: "Culture, patrimoine et édition",
    onisepSecteurs: ["Culture et patrimoine", "Édition, librairie, bibliothèque"],
    weights: { A: 2, I: 2, C: 1, S: 1 },
    exemples: ["Bibliothécaire", "Éditeur", "Conservateur du patrimoine"],
  },
  {
    id: "communication",
    label: "Communication, journalisme et langues",
    onisepSecteurs: ["Communication", "Journalisme", "Traduction, interprétation"],
    weights: { A: 2, E: 2, S: 1, I: 1 },
    exemples: ["Journaliste", "Chargé de communication", "Traducteur"],
  },
  {
    id: "commerce",
    label: "Commerce, marketing et distribution",
    onisepSecteurs: ["Commerce et distribution", "Marketing, publicité"],
    weights: { E: 3, S: 1, C: 1, A: 1 },
    exemples: ["Responsable de magasin", "Chef de produit", "Commercial"],
  },
  {
    id: "banque",
    label: "Banque, assurance et immobilier",
    onisepSecteurs: ["Banque et assurance", "Immobilier"],
    weights: { E: 2, C: 3, I: 1 },
    exemples: ["Conseiller bancaire", "Agent immobilier", "Actuaire"],
  },
  {
    id: "gestion",
    label: "Gestion, comptabilité et ressources humaines",
    onisepSecteurs: ["Comptabilité, gestion, ressources humaines"],
    weights: { C: 3, E: 1, S: 1 },
    exemples: ["Comptable", "Gestionnaire de paie", "Chargé de recrutement"],
  },
  {
    id: "droit",
    label: "Droit, sécurité et défense",
    onisepSecteurs: ["Droit et justice", "Sécurité", "Défense"],
    weights: { E: 2, S: 1, C: 2, R: 1, I: 1 },
    exemples: ["Juriste", "Policier", "Militaire"],
  },
  {
    id: "medical",
    label: "Médical et recherche",
    onisepSecteurs: ["Médical", "Recherche"],
    weights: { I: 3, S: 2, R: 1 },
    exemples: ["Médecin", "Chercheur", "Pharmacien"],
  },
  {
    id: "paramedical",
    label: "Paramédical",
    onisepSecteurs: ["Paramédical"],
    weights: { S: 3, I: 1, R: 1 },
    exemples: ["Infirmier", "Kinésithérapeute", "Orthophoniste"],
  },
  {
    id: "social",
    label: "Social et enseignement",
    onisepSecteurs: ["Social", "Enseignement"],
    weights: { S: 3, A: 1, E: 1 },
    exemples: ["Enseignant", "Éducateur spécialisé", "Assistant de service social"],
  },
  {
    id: "sport",
    label: "Sport",
    onisepSecteurs: ["Sport"],
    weights: { R: 2, S: 2, E: 1 },
    exemples: ["Éducateur sportif", "Entraîneur", "Préparateur physique"],
  },
  {
    id: "tourisme",
    label: "Tourisme, hôtellerie et restauration",
    onisepSecteurs: ["Hôtellerie, restauration", "Tourisme"],
    weights: { S: 2, E: 2, R: 1, A: 1 },
    exemples: ["Cuisinier", "Réceptionniste", "Guide touristique"],
  },
  {
    id: "numerique",
    label: "Informatique et électronique",
    onisepSecteurs: ["Informatique", "Électronique"],
    weights: { I: 3, R: 1, C: 1 },
    exemples: ["Développeur", "Technicien réseau", "Ingénieur en électronique"],
  },
  {
    id: "mecanique",
    label: "Mécanique, automobile et maintenance",
    onisepSecteurs: ["Mécanique", "Automobile", "Maintenance"],
    weights: { R: 3, I: 1, C: 1 },
    exemples: ["Mécanicien automobile", "Technicien de maintenance", "Usineur"],
  },
  {
    id: "transport",
    label: "Aéronautique, ferroviaire, naval et logistique",
    onisepSecteurs: ["Construction aéronautique, ferroviaire et navale", "Logistique et transport"],
    weights: { R: 2, C: 2, I: 1, E: 1 },
    exemples: ["Technicien aéronautique", "Responsable logistique", "Conducteur de train"],
  },
  {
    id: "energie",
    label: "Énergie, chimie et matériaux",
    onisepSecteurs: ["Énergie", "Industrie chimique", "Verre, béton, céramique", "Papiers cartons"],
    weights: { I: 2, R: 2, C: 1 },
    exemples: ["Technicien de laboratoire", "Opérateur de centrale", "Ingénieur procédés"],
  },
  {
    id: "mode",
    label: "Mode et luxe",
    onisepSecteurs: ["Mode et luxe"],
    weights: { A: 3, E: 1, R: 1 },
    exemples: ["Styliste", "Modéliste", "Responsable de collection"],
  },
];
