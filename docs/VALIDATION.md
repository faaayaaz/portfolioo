# Data Island validation — 30 October 2026

The redesigned production application was built and run with Node 24 and Chromium. This verifies the current cloud instance and the tested build; it is not a claim of deployment or validation on a public host.

| Check | Result |
| --- | --- |
| TypeScript + client/server production builds | Passed |
| Contact input/spam-protection unit tests | 5 passed |
| Browser tests against the production server | 13 passed |
| Actual 3D rendering and WASD rover movement | Passed in Chromium with software WebGL |
| Four map destinations, discovery counter and restart | Passed |
| Project browser, keyboard navigation and case-study links | Passed |
| Automated WCAG AA checks | Passed in all five themes |
| Responsive layout / horizontal overflow | Passed at 360, 768, 1024, 1440, 3840 pixels |
| Case studies, PDF download, lab filters, CSV export, theme persistence, command menu, mobile drawer and contact draft | Passed |

Latest Lighthouse mobile audit of the local production homepage:

| Category | Score |
| --- | ---: |
| Performance | 96 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

First contentful paint: 2.3 seconds. Largest contentful paint: 2.3 seconds. Total blocking time: 10 milliseconds. Cumulative layout shift: 0.011. These measurements cover the illustrated-map initial mobile experience. They do not measure 3D frame rate or guarantee the same score after explicitly enabling 3D on a phone. Scores vary by hosting, network, device and run. Automated accessibility results are not a complete manual audit.

The island scene is a lazy-loaded desktop enhancement and an explicit mobile option. It starts as an illustrated map on screens below 700px, reduced-motion, low-power and data-saving configurations. Every destination and case study remains reachable through HTML controls, including after a WebGL failure. The rendering loop pauses when offscreen or the document is hidden. The large optional Three.js chunk is approximately 225 kB gzipped; it is not part of the initial mobile download. No fixed frame-rate guarantee is made.

The full original contact, project and dashboard checks were retained; the new checks exercise meaningful interactive behavior rather than only the presence of a canvas. Windows-compatible `npm start` remains in place. Installation dependencies and lockfile are unchanged by the redesign.

Direct SMTP delivery is still untested because no provider is configured. The contact flow prepares a complete email draft without claiming delivery. Calendar scheduling uses an email request. Project visuals and healthcare data remain illustrative/synthetic. Arabic localization and original employer dashboard screenshots are not included.

See [design research](DESIGN-RESEARCH.md) for the professional references actually examined and the live-network limitations. No website deployment or environment publication was performed for this redesign.
