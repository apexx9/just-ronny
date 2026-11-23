// Generated from the APX logo build. One source of truth for the header logo, OG image and rotating favicon.
export const BRAND = {
  bg: "#141414",
  palette: {
  "orange": "#F2784B",
  "gold": "#F5C518",
  "paper": "#F2EFE6",
  "green": "#3DBB78"
} as const,
  // every glyph lives in a 32x32 cell; each entry is one SVG path (draw with fill-rule evenodd)
  glyphs: {
  "A": [
    "M13.09 5.81Q16 0 18.91 5.81L29.76 27.53Q32 32 27 32L5 32Q0 32 2.24 27.53Z"
  ],
  "P": [
    "M3 0H21A11 11 0 0 1 21 22H10V29A3 3 0 0 1 7 32H3A3 3 0 0 1 0 29V3A3 3 0 0 1 3 0Z"
  ],
  "X": [
    "M4.33 13.17L18.83 27.67A6.25 6.25 0 0 0 27.67 18.83L13.17 4.33A6.25 6.25 0 0 0 4.33 13.17Z",
    "M13.17 27.67L27.67 13.17A6.25 6.25 0 0 0 18.83 4.33L4.33 18.83A6.25 6.25 0 0 0 13.17 27.67Z"
  ]
} as Record<string, string[]>,
} as const;

export type Letter = { id: string; color: keyof typeof BRAND.palette };

export const APX: Letter[] = [{"id": "A", "color": "orange"}, {"id": "P", "color": "gold"}, {"id": "X", "color": "green"}];
export const LOGO_LETTERS: Letter[] = APX;
