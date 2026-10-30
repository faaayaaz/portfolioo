import { worldContent } from "../../data/world";
export default function IslandMap({
  onVisit,
}: {
  onVisit: (id: string) => void;
}) {
  return (
    <svg
      className="island-map"
      viewBox="0 0 1200 760"
      role="img"
      aria-label="Illustrated map of Fayaz’s data island with four project destinations"
    >
      <defs>
        <linearGradient id="islandRock" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#426c6c" />
          <stop offset="1" stopColor="#263c54" />
        </linearGradient>
        <radialGradient id="mapGlow">
          <stop stopColor="#8dcdd4" stopOpacity=".3" />
          <stop offset="1" stopColor="#8dcdd4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="680" cy="630" rx="390" ry="80" fill="url(#mapGlow)" />
      <ellipse cx="680" cy="434" rx="355" ry="164" fill="url(#islandRock)" />
      <path
        d="M325 420v53l115 91 180 38 190-9 175-72 50-75-4-36Z"
        fill="url(#islandRock)"
      />
      <ellipse cx="680" cy="410" rx="355" ry="164" fill="#8fc4ae" />
      <ellipse cx="680" cy="405" rx="335" ry="145" fill="#b0d9b4" />
      <ellipse
        cx="680"
        cy="412"
        rx="240"
        ry="95"
        fill="none"
        stroke="#e5e5ca"
        strokeWidth="22"
      />
      <g transform="translate(435 300)">
        <path d="M-50 40l65-31 75 33-64 33z" fill="#9bbfb4" />
        <path d="M-42 39V-32l68 29v73z" fill="#d6e6de" />
        <path d="M26-3l57-26v70L26 70z" fill="#a4bfc3" />
        <path d="M-42-32l57-26 68 29L26-3z" fill="#f4f0dd" />
        <path d="M-24 2l34 14M-24 21l34 14" stroke="#77a9bd" strokeWidth="8" />
        <path d="M43-4v32m-12-9 24-11" stroke="#e37d72" strokeWidth="9" />
      </g>
      <g transform="translate(700 270)">
        <ellipse cy="67" rx="62" ry="27" fill="#e9e6d1" />
        <ellipse cy="61" rx="62" ry="27" fill="#faf5df" />
        <ellipse
          rx="42"
          ry="63"
          fill="none"
          stroke="#bb98e4"
          strokeWidth="8"
          transform="rotate(25)"
        />
        <ellipse
          rx="42"
          ry="63"
          fill="none"
          stroke="#98b1ef"
          strokeWidth="5"
          transform="rotate(-30)"
        />
        <path d="M0-32l30 22-9 36-37 4-16-29z" fill="#b9a4df" />
      </g>
      <g transform="translate(878 391)">
        {[
          [-48, 45],
          [-20, 80],
          [8, 110],
          [36, 65],
        ].map(([x, h], i) => (
          <g key={x}>
            <path
              d={`M${x} 20v-${h}l19-9v${h}z`}
              fill={["#9fa9de", "#86b6b4", "#e7ba7c", "#ad9ed2"][i]}
            />
            <path d={`M${x + 19} ${11 - h}l13 8v${h}l-13-8z`} fill="#668e90" />
          </g>
        ))}
      </g>
      <g transform="translate(686 497)">
        <path d="M-40 0v-42l42 20v43z" fill="#e7e5d7" />
        <path d="M2-22l43-21V0L2 21z" fill="#c0d5d2" />
        <path d="M-48-42l47-47 54 47-51 25z" fill="#678a9e" />
        <path
          d="M65-40v-72m-16 17q16-23 32 0m-40-5q24-36 48 0"
          stroke="#8bbfea"
          strokeWidth="5"
          fill="none"
        />
      </g>
      <g transform="translate(565 435)">
        <ellipse cy="8" rx="24" ry="11" fill="#4c7e7866" />
        <path d="M-19-5l24-12 20 10-24 13z" fill="#fff5de" />
        <path d="M-19-5v15l20 10V6z" fill="#c5d2d3" />
        <path d="M1 6l24-13v15L1 20z" fill="#708a9c" />
        <path d="M-10-9l15-6 12 6-15 7z" fill="#304b60" />
        <circle cx="-12" cy="12" r="7" fill="#243b4d" />
        <circle cx="17" cy="14" r="7" fill="#243b4d" />
      </g>
      {[
        [355, 430],
        [480, 490],
        [790, 475],
        [905, 357],
        [553, 280],
      ].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <path d="M0 0v-34" stroke="#5b7c65" strokeWidth="6" />
          <path d="M-22-25L0-77l22 52z" fill="#5d9b86" />
          <path d="M-18-44L0-87l18 43z" fill="#78af92" />
        </g>
      ))}
      {worldContent.stations.map((s, i) => (
        <g
          key={s.id}
          className="map-destination"
          onClick={() => onVisit(s.id)}
          transform={`translate(${[452, 700, 880, 703][i]} ${[245, 170, 285, 550][i]})`}
        >
          <rect
            x="-72"
            y="-18"
            width="144"
            height="36"
            rx="18"
            fill="#15273d"
          />
          <circle cx="-53" r="4" fill={s.color} />
          <text x="-40" y="4" fill="#fff" fontSize="12" fontFamily="sans-serif">
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
