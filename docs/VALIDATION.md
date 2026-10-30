# Portfolio validation — 30 October 2026

This revision replaces the rejected 3D island and directly addresses reported lag. Local production validation used Node 24 and Chromium. It does not establish performance on the user's computer or a deployed host.

| Check                                                                           | Result                                                |
| ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| TypeScript + production client/server build                                     | Passed                                                |
| Contact-validation tests                                                        | 5 passed                                              |
| Browser checks                                                                  | 13 passed |
| Responsive layout, no horizontal overflow                                       | Passed at 360, 768, 1024, 1440, 3840px                |
| Automated WCAG AA checks                                                        | Passed in all five themes                             |
| Hero filter, exact Cardiology total (1,252), metric switch and data table       | Passed                                                |
| Project selection, keyboard navigation and case-study links                     | Passed                                                |
| Explicit full-dashboard loading, filters and CSV export                         | Passed                                                |
| Résumé PDF, mobile navigation, command palette, persisted themes, contact draft | Passed                                                |
| Initial WebGL canvas / heavy chart module                                       | None; chart module loads only when opened             |
| Runtime errors during visual/benchmark checks                                   | None                                                  |

## Responsiveness comparison

The same controlled local test, with a 4× CPU slowdown and software WebGL available, observed 31 frames in about three seconds on the old island and 182 on the new portfolio. The 95th-percentile frame interval changed from 116.6 ms to 16.7 ms; frame intervals over 34 ms changed from 30 to zero. Initial encoded JavaScript delivery decreased from 376,346 to 100,593 bytes, approximately 73%.

See [the performance investigation](PERFORMANCE.md) for the method and limits. This measures frame contention, not standardized INP, and does not guarantee identical behavior on every device. The earlier mobile Lighthouse result measured the map fallback and was not a measure of the rejected 3D experience's smoothness.

## Current mobile Lighthouse audit

| Category       | Score |
| -------------- | ----: |
| Performance    |    97 |
| Accessibility  |   100 |
| Best practices |   100 |
| SEO            |   100 |

First contentful paint: 2.1 seconds. Largest contentful paint: 2.3 seconds. Total blocking time: 10 ms. Cumulative layout shift: 0.001. This is a local simulated-mobile homepage audit; scores vary by hosting, device, network and run. Automated accessibility tests do not replace a manual audit.

Direct SMTP delivery remains untested without provider settings. The tested contact flow offers a complete email draft and does not claim delivery. Calendar scheduling uses an email request. Healthcare examples and visuals are synthetic/illustrative; Arabic localization and original employer dashboard screenshots are not included. No environment publication or website deployment was performed for this revision.
