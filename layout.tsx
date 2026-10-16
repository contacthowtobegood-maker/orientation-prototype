import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orientation, prototype",
  description:
    "Découvre tes centres d'intérêt en quelques cartes à swiper, puis explore des domaines et des métiers. Prototype de démonstration, sans données personnelles.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#14213d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a className="skip" href="#contenu">Aller au contenu</a>
        <header className="topbar">
          <Link href="/">Orientation (prototype)</Link>
          <Link href="/aide">Qui peut t'aider</Link>
        </header>
        <main id="contenu" className="page">{children}</main>
      </body>
    </html>
  );
}
