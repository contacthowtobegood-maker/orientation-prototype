"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DIMS, type Niveau } from "@/data/types";
import { DIM_INFO } from "@/data/dims";
import { construireBilan, calculerProfil, type Bilan, type Profil, type Suggestion } from "@/lib/scoring";
import { effacerReponses, lireReponses } from "@/lib/storage";
import { MATRICE_VERSION } from "@/data/domaines";

const NIVEAU_TXT: Record<Niveau, string> = {
  forte: "Affinité forte",
  moyenne: "Affinité moyenne",
  faible: "Affinité faible",
};
const NIVEAU_POINTS: Record<Niveau, number> = { forte: 3, moyenne: 2, faible: 1 };

function NiveauBadge({ niveau }: { niveau: Niveau }) {
  return (
    <span className="niveau">
      <span className="points" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <i key={n} className={n <= NIVEAU_POINTS[niveau] ? "on" : ""} />
        ))}
      </span>
      {NIVEAU_TXT[niveau]}
    </span>
  );
}

function Carte({ s, surprise }: { s: Suggestion; surprise?: boolean }) {
  return (
    <article className="panel suggestion">
      <h3>
        {s.domaine.label} <NiveauBadge niveau={s.niveau} />
        {surprise && <span className="tag">Piste inattendue</span>}
      </h3>
      <p>{s.explication}</p>
      <p className="small muted" style={{ marginBottom: 0 }}>
        Exemples de métiers : {s.domaine.exemples.join(", ")}.
      </p>
    </article>
  );
}

function Dimensions({ profil }: { profil: Profil }) {
  return (
    <div>
      {profil.classement.map((d) => {
        const info = DIM_INFO[d];
        const part = Math.round(profil.scores[d] * 6);
        return (
          <div className="dimrow" key={d}>
            <span className="pastille" style={{ background: info.couleur }} aria-hidden="true">{d}</span>
            <div>
              <div className="nom">
                <span><span aria-hidden="true">{info.picto} </span>{info.nom}</span>
                <span className="small muted">{part} carte{part > 1 ? "s" : ""} sur 6</span>
              </div>
              <div className="barre" aria-hidden="true">
                <span style={{ width: `${(profil.scores[d] * 100).toFixed(0)}%`, background: info.couleur }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const STAB_TXT = {
  esquisse: "Une esquisse : réponds à plus de cartes pour la préciser.",
  "se precise": "Ton profil se précise.",
  solide: "Ton profil est solide : tu as répondu à presque toutes les cartes.",
} as const;

export default function BilanView() {
  const router = useRouter();
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const a = lireReponses();
    setProfil(calculerProfil(a));
    setBilan(construireBilan(a));
    setPret(true);
  }, []);

  if (!pret) return <p aria-live="polite">Calcul de ton bilan…</p>;

  if (!bilan || !profil) {
    return (
      <>
        <h1>Il manque encore quelques réponses</h1>
        <p>
          Pour que le bilan soit fiable, il faut avoir répondu à au moins 24 cartes (les cartes passées ne comptent pas).
          Tu en es à {profil?.repondues ?? 0}.
        </p>
        <p><Link className="btn btn-primaire" href="/profil">Reprendre les cartes</Link></p>
      </>
    );
  }

  return (
    <>
      <h1>Ton bilan</h1>
      <p>{STAB_TXT[profil.stabilite]}</p>

      <section aria-labelledby="h-profil">
        <h2 id="h-profil">Ce qui te plaît le plus</h2>
        {profil.differencie ? (
          <>
            <p>
              Ton code d'intérêts : <span className="code" aria-label={profil.code.split("").join(" ")}>{profil.code}</span>
            </p>
            {profil.ex_aequo && (
              <p className="small muted">
                Certaines de tes dimensions sont à égalité : ce code n'est pas définitif, c'est un point de départ.
              </p>
            )}
          </>
        ) : (
          <div className="panel attention">
            <p style={{ marginBottom: 0 }}>
              Tes réponses sont très homogènes : aucune famille d'intérêts ne ressort nettement. Plutôt que de te proposer
              des domaines au hasard, on te conseille d'en parler avec un conseiller (voir plus bas) ou de refaire les
              cartes en choisissant plus franchement.
            </p>
          </div>
        )}
        <Dimensions profil={profil} />
      </section>

      {bilan.suggestions.length > 0 && (
        <section aria-labelledby="h-domaines">
          <h2 id="h-domaines">Des domaines à explorer</h2>
          <p className="muted">
            L'affinité dit à quel point un domaine rejoint tes goûts, pas si tu es fait pour ce domaine ni s'il recrute.
          </p>
          {bilan.suggestions.map((s) => <Carte key={s.domaine.id} s={s} />)}
          {bilan.surprises.map((s) => <Carte key={s.domaine.id} s={s} surprise />)}
          {bilan.autres.length > 0 && (
            <>
              <h3>D'autres pistes</h3>
              {bilan.autres.map((s) => <Carte key={s.domaine.id} s={s} />)}
            </>
          )}
        </section>
      )}

      <section className="panel" aria-labelledby="h-suite">
        <h2 id="h-suite">Et maintenant ?</h2>
        <p>
          Un bilan sur cartes ne remplace pas un échange avec un professionnel. Tu peux en parler gratuitement avec des
          conseillers qui connaissent les formations et les métiers.
        </p>
        <p><Link className="btn btn-primaire" href="/aide">Voir qui peut t'aider</Link></p>
      </section>

      <p className="small muted">
        Version de démonstration (correspondances {MATRICE_VERSION}). Les liens vers les fiches métiers, les formations et les
        offres d'alternance seront ajoutés à partir des données publiques de l'Onisep, de France Travail et de La Bonne Alternance.
      </p>
      <p>
        <button
          type="button"
          className="btn btn-lien"
          onClick={() => {
            effacerReponses();
            router.push("/profil");
          }}
        >
          Recommencer
        </button>
      </p>
    </>
  );
}
