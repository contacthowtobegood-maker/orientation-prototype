# Orientation, prototype V1

Prototype jouable du méga prompt (sections 3, 4, 5, 9 et 14), sans compte, sans base de données et sans donnée envoyée à un serveur :
les réponses vivent dans `sessionStorage` et disparaissent à la fermeture de l'onglet.

## Lancer

```
npm install
npm run dev        # http://localhost:3000
npm test           # moteur de scoring + contrastes WCAG
npm run build && npm start
```

## Contenu

- `src/data/items.ts` : 36 cartes originales (6 par dimension RIASEC), PROVISOIRES.
- `src/data/domaines.ts` : 20 familles de domaines regroupant les 45 secteurs affichés sur onisep.fr, matrice d'affinités v0-provisoire.
- `src/lib/scoring.ts` : profil et matching déterministes (niveaux forte/moyenne/faible, explications, pistes inattendues, aucun pourcentage).
- `src/data/structures.ts` : structures relais de la section 9.
- `app/globals.css` : tokens de couleurs de la section 14 (clair et sombre) ; `tests/contraste.test.ts` échoue si un contraste passe sous le seuil.

## À faire avant tout usage réel

1. Faire valider les items et la matrice par des psychologues / conseillers d'orientation.
2. Remplacer les 20 familles provisoires par la nomenclature Idéo officielle (20 domaines, 132 sous-domaines, data.gouv.fr) ; le téléchargement n'était pas possible depuis l'environnement de développement.
3. Vérifier chaque lien de `structures.ts` et les coordonnées des structures.
4. Décider du nom, du porteur juridique, du DPO et de l'hébergeur (indépendants du SUIO et d'amU) avant d'enregistrer la moindre donnée.
5. Brancher ensuite Onisep, France Travail et La Bonne Alternance côté serveur, sans jamais envoyer de donnée personnelle.
