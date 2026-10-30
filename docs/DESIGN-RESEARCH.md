# Data Island: reference research and redesign

Research checked 30 October 2026. The chosen direction was explicitly **an immersive 3D experience: a playful world visitors move through**.

## Sources actually examined

1. [Bruno Simon — Folio 2025, official source](https://github.com/brunosimon/folio-2025). Examined the current repository README, package manifest, and its author-supplied social preview. The README documents vehicle input, physics, interactive points, separate areas, weather, and a rendering/monitoring loop. The preview visibly places a vehicle in a stylized 3D environment. This is the strongest and most recent dated portfolio reference verified in this session.
2. [Bruno Simon — Folio 2019, official source](https://github.com/brunosimon/folio-2019). Examined the README as a historical comparison, not a new launch.
3. [Brittany Chiang — v4, official source](https://github.com/bchiang7/v4). Examined the README: coherent palette, responsive developer portfolio, project-first presentation, and explicit attribution guidance. This is an older reference, not evidence of a current 2026 redesign.
4. [Rauno Freiberg — public historical portfolio source](https://github.com/raunofreiberg/raunofreiberg.github.io/blob/master/portfolio.html). Examined actual project presentation with a description, technology context, and repository actions. The repository identifies itself as work in progress; it was not treated as the current rauno.me design.

Direct requests to bruno-simon.com, dennissnellenberg.com, brittanychiang.com, sxywu.com and rauno.me were denied by the cloud environment’s network policy. Current live interaction, launch recency beyond the named 2025 repository, awards/rankings and performance of those sites were not independently verified. Shirley Wu’s public repository returned a minimal draft page, so it was not used as design evidence. No external code, 3D models, images, sounds, or site layouts were copied into this implementation.

## What changed

The previous design put most interaction below a conventional portrait hero and a long sequence of sections. The new opening is an original explorable island built for Fayaz’s four actual portfolio subjects:

- **Care Campus:** healthcare reporting and the working synthetic dashboard.
- **Neural Garden:** the academic CNN project, represented by an orbital sculpture.
- **People Park:** workforce analytics, represented by an architectural bar chart.
- **Connected Cove:** the NodeMCU/Blynk project, represented by a smart home and signal antenna.

A rover moves with WASD/arrow keys, touch controls, destination shortcuts, or ground clicks. Destinations open contextual project panels. Discovery progress, collectible insights, zoom/rotate controls and a reset action give visitors something to do. The project gallery below the world is an accessible, keyboard-operable browser with distinct visuals and directly reachable case studies.

The original content, résumé download, theme selection, command palette, accessible navigation, contact flow and full case-study routes remain available. The world is an optional interface to that information, not an access requirement. Reduced motion, low-power or data-saving settings use an illustrated map; scene failures return to that map. The scene stops rendering when offscreen or the document is hidden. All healthcare demonstration data remains synthetic.

The new island is original procedural geometry and an original SVG fallback. Inspiration is in the discovery pattern; the setting, models, content, code and interface are specific to this portfolio.
