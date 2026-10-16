import SwipeDeck from "@/components/SwipeDeck";

export const metadata = { title: "Les cartes, Orientation (prototype)" };

export default function Profil() {
  return (
    <>
      <h1>Ça te ressemble ?</h1>
      <SwipeDeck />
    </>
  );
}
