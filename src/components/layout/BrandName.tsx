import { Hind } from "next/font/google";

// Brand name in a bold, conventional Devanagari face to match public/logo.png.
// Halant's क्त conjunct / ि shaping differs from the logo. Single weight only.
// letter-spacing is reset: tracking breaks conjunct shaping.
const hind = Hind({ weight: "700", subsets: ["devanagari"], display: "swap" });

export function BrandName({ className = "" }: { className?: string }) {
  return (
    <span className={`${hind.className} tracking-normal normal-case ${className}`}>
      जनशक्ति उजाला
    </span>
  );
}
