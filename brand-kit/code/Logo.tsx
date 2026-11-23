import { BRAND, LOGO_LETTERS } from "@/lib/brand";

const GAP = 8;

/** The mark. Each letter is its own <g> so CSS can hop them one by one on hover (see logo.css). */
export default function Logo({ height = 24, title = "Aaron Nartey" }: { height?: number; title?: string }) {
  const n = LOGO_LETTERS.length;
  const w = n * 32 + (n - 1) * GAP;
  return (
    <svg
      className="logo"
      viewBox={`0 0 ${w} 32`}
      height={height}
      width={(w / 32) * height}
      role="img"
      aria-label={title}
    >
      {LOGO_LETTERS.map((l, i) => (
        <g key={i} transform={`translate(${i * (32 + GAP)} 0)`}>
          <g className="logo-glyph" style={{ ["--i" as string]: i }} fill={BRAND.palette[l.color]}>
            {BRAND.glyphs[l.id].map((d, k) => (
              <path key={k} d={d} fillRule="evenodd" />
            ))}
          </g>
        </g>
      ))}
    </svg>
  );
}
