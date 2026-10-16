/** @type {import('next').NextConfig} */
// Export statique : le site est un ensemble de fichiers, hébergeable sur GitHub Pages, Netlify, Cloudflare Pages, etc.
// NEXT_PUBLIC_BASE_PATH vaut "/nom-du-depot" sur GitHub Pages (renseigné par le workflow), vide ailleurs.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};
export default nextConfig;
