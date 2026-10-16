"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { orderedItems } from "@/data/items";
import type { Answer } from "@/data/types";
import type { Answers } from "@/lib/scoring";
import { ecrireReponses, lireReponses } from "@/lib/storage";

const ITEMS = orderedItems();
const SEUIL_SWIPE = 90;

export default function SwipeDeck() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [pret, setPret] = useState(false);
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const [annonce, setAnnonce] = useState("");
  const depart = useRef<number | null>(null);

  useEffect(() => {
    setAnswers(lireReponses());
    setPret(true);
  }, []);

  const index = ITEMS.findIndex((it) => !answers[it.id]);
  const courant = index === -1 ? null : ITEMS[index];
  const faites = index === -1 ? ITEMS.length : index;

  useEffect(() => {
    if (pret && index === -1) router.push("/bilan");
  }, [pret, index, router]);

  const repondre = useCallback(
    (a: Answer) => {
      if (!courant) return;
      const next = { ...answers, [courant.id]: a };
      setAnswers(next);
      ecrireReponses(next);
      setDx(0);
      setAnnonce(a === "like" ? "Ça me ressemble" : a === "dislike" ? "Pas pour moi" : "Carte passée");
    },
    [answers, courant],
  );

  const retour = useCallback(() => {
    if (faites === 0) return;
    const prec = ITEMS[faites - 1];
    const next = { ...answers };
    delete next[prec.id];
    setAnswers(next);
    ecrireReponses(next);
    setAnnonce("Retour à la carte précédente");
  }, [answers, faites]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); repondre("like"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); repondre("dislike"); }
      else if (e.key === "ArrowDown") { e.preventDefault(); repondre("skip"); }
      else if (e.key === "Backspace") { e.preventDefault(); retour(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [repondre, retour]);

  if (!pret || !courant) return <p aria-live="polite">Chargement des cartes…</p>;

  const pct = Math.round((faites / ITEMS.length) * 100);
  const intensite = Math.min(Math.abs(dx) / SEUIL_SWIPE, 1);

  return (
    <div>
      <p className="small" id="progress-label">
        Carte {faites + 1} sur {ITEMS.length}
      </p>
      <div
        className="progress"
        role="progressbar"
        aria-labelledby="progress-label"
        aria-valuemin={0}
        aria-valuemax={ITEMS.length}
        aria-valuenow={faites}
      >
        <span style={{ width: `${pct}%` }} />
      </div>

      <div className="deck">
        <div
          className={`card${drag ? " drag" : ""}`}
          style={{ transform: `translateX(${dx}px) rotate(${dx / 25}deg)` }}
          onPointerDown={(e) => {
            depart.current = e.clientX;
            setDrag(true);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (depart.current !== null) setDx(e.clientX - depart.current);
          }}
          onPointerUp={() => {
            const d = dx;
            depart.current = null;
            setDrag(false);
            if (d > SEUIL_SWIPE) repondre("like");
            else if (d < -SEUIL_SWIPE) repondre("dislike");
            else setDx(0);
          }}
          onPointerCancel={() => {
            depart.current = null;
            setDrag(false);
            setDx(0);
          }}
        >
          <span className="stamp oui" aria-hidden="true" style={{ opacity: dx > 0 ? intensite : 0 }}>Ça me ressemble</span>
          <span className="stamp non" aria-hidden="true" style={{ opacity: dx < 0 ? intensite : 0 }}>Pas pour moi</span>
          <p className="kicker">Est-ce que ça te plairait de…</p>
          <p className="enonce">{courant.text}</p>
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn btn-non" onClick={() => repondre("dislike")}>
          <span aria-hidden="true">✕</span> Pas pour moi
        </button>
        <button type="button" className="btn btn-lien" onClick={() => repondre("skip")}>
          Passer
        </button>
        <button type="button" className="btn btn-aime" onClick={() => repondre("like")}>
          <span aria-hidden="true">♥</span> Ça me ressemble
        </button>
      </div>
      <p className="actions" style={{ marginTop: 8 }}>
        <button type="button" className="btn btn-lien" onClick={retour} disabled={faites === 0}>
          Revenir à la carte précédente
        </button>
      </p>
      <p className="small muted aide-clavier">
        Sur ordinateur : flèche droite = ça me ressemble, flèche gauche = pas pour moi, flèche bas = passer, Retour arrière = carte précédente.
      </p>
      <div className="sr-only" aria-live="polite" style={{ position: "absolute", left: -9999 }}>{annonce}</div>
    </div>
  );
}
