/* The hero's origin mark: a static silhouette of Ghana with a gold star at
   the country's centre, set against a compact typographic lockup.

   The outline is derived from Natural Earth 1:50m admin-0 boundaries
   (public domain), projected with an equirectangular scale and simplified
   from 213 points to 50 so it stays crisp at its 2.65rem display size.
   Star centre is the polygon centroid (25.36, 33.08) in this viewBox. */
export function GhanaSignature() {
  return (
    <div
      className="hx-origin"
      role="img"
      aria-label="Proudly Ghanaian, Accra, Ghana"
    >
      <svg
        className="hx-origin-map"
        viewBox="0 0 54 66"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="hx-origin-outline"
          d="M35.61 4.46 L36.31 5.32 L35.45 8.47 L39.64 11.92 L39.13 17.4
             L38.6 17.79 L39.3 18.15 L38.32 19.43 L39.86 19.17 L40.94 20.02
             L40.61 24.97 L39.56 25.8 L42.38 29.47 L41.46 31.36 L41.65 35.14
             L40.71 36.78 L40.79 37.8 L41.92 38.53 L40.94 43.09 L42.83 46.69
             L45.06 47.89 L46.87 49.98 L44.74 52.51 L38.55 52.99 L29.07 57.8
             L22.75 59.5 L18.27 62 L14.71 60.49 L8.29 59.05 L10.97 58.46
             L11.51 55.93 L11.17 54.41 L9.33 53.41 L7.31 46.8 L7.2 43.48
             L9.44 39.88 L11.2 33.3 L13.75 30.79 L12.9 25.43 L11.59 23.22
             L12.24 21.06 L11.29 16.87 L11.41 12.41 L11.19 10.65 L10.08 9.2
             L10.84 5.53 L26.87 5.42 L29.93 5.61 L30.6 6.17 L33.54 4 Z"
        />

        <path
          className="hx-origin-star"
          d="M25.36 28.68 L26.52 31.48 L29.54 31.72 L27.24 33.69
             L27.95 36.64 L25.36 35.06 L22.77 36.64 L23.48 33.69
             L21.18 31.72 L24.2 31.48 Z"
        />
      </svg>

      <span className="hx-origin-copy">
        <span className="hx-origin-kicker">PROUDLY</span>
        <span className="hx-origin-name">GHANAIAN</span>
        <span className="hx-origin-place">ACCRA · GHANA</span>

        <span className="hx-origin-colours" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </span>
    </div>
  );
}
