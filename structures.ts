/** Structures relais, reprises de la section 9 du méga prompt. Les liens ne sont renseignés que s'ils ont été vérifiés. */
export interface Structure {
  nom: string;
  pourQui: string;
  apporte: string;
  lien?: { url: string; libelle: string };
}

export const STRUCTURES: Structure[] = [
  {
    nom: "CIO (centre d'information et d'orientation)",
    pourQui: "Tout public, scolarisé ou non, accueil gratuit",
    apporte: "Entretien avec un psychologue de l'Éducation nationale spécialisé en orientation, information sur les formations et les métiers",
  },
  {
    nom: "Réseau Info Jeunes (CIDJ, centres régionaux, BIJ, PIJ)",
    pourQui: "Tout jeune, accueil gratuit et sans rendez-vous",
    apporte: "Information sur l'orientation, l'emploi, la mobilité, le logement, la santé, l'accès aux droits",
    lien: { url: "https://www.cidj.com", libelle: "cidj.com" },
  },
  {
    nom: "Service d'orientation de ton établissement",
    pourQui: "Élèves et étudiants",
    apporte: "Conseils, ateliers et accompagnement de projet sur place",
  },
  {
    nom: "Mission locale",
    pourQui: "Jeunes de 16 à 25 ans (jusqu'à 29 ans en situation de handicap), sortis du système scolaire ou sans emploi",
    apporte: "Accompagnement global (emploi, formation, aides), dont le contrat d'engagement jeune",
  },
  {
    nom: "France Travail",
    pourQui: "Personnes en recherche d'emploi",
    apporte: "Inscription, offres, formations, contrat d'engagement jeune",
    lien: { url: "https://www.francetravail.fr", libelle: "francetravail.fr" },
  },
  {
    nom: "1jeune1solution",
    pourQui: "Jeunes de 15 à 30 ans",
    apporte: "Portail public qui recense offres, formations, alternance et accompagnement",
    lien: { url: "https://www.1jeune1solution.gouv.fr", libelle: "1jeune1solution.gouv.fr" },
  },
  {
    nom: "École de la deuxième chance (E2C)",
    pourQui: "Jeunes de 16 à 25 ans sortis du système scolaire sans qualification et sans emploi",
    apporte: "Parcours individualisé de 4 mois à 2 ans, rémunéré, avec des périodes en entreprise ; admission souvent par l'intermédiaire de la mission locale",
  },
  {
    nom: "EPIDE (établissement pour l'insertion dans l'emploi)",
    pourQui: "Jeunes de 17 à 25 ans sans diplôme ni qualification, en difficulté pour trouver un emploi ou une formation",
    apporte: "Internat et parcours intensif d'environ 8 à 9 mois, contrat de volontariat, stages en entreprise",
    lien: { url: "https://www.epide.fr", libelle: "epide.fr" },
  },
  {
    nom: "Cité des métiers (là où il en existe une)",
    pourQui: "Tout public, accès libre, anonyme et gratuit",
    apporte: "Information sur l'orientation, la formation, l'emploi et la création d'activité, sans rendez-vous ; toutes les villes n'en ont pas",
  },
];

export const CAP_EMPLOI: Structure = {
  nom: "Cap emploi",
  pourQui: "Personnes en situation de handicap, y compris les jeunes",
  apporte: "Accompagnement spécialisé vers et dans l'emploi : projet professionnel, recherche, relation avec les employeurs, aides à l'embauche",
};

export const ANNUAIRE = { url: "https://lannuaire.service-public.fr", libelle: "L'annuaire de l'administration (service-public.fr)" };
