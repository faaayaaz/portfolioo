# Validation — 30 October 2026

The local production application was built and run with Node 24 and Chromium. This verifies the current instance; it is not a claim of deployment or validation on a public host.

| Check | Result |
| --- | --- |
| Frozen install (`npm ci --no-audit --no-fund`) | Passed, 501 packages |
| TypeScript + client/server production builds | Passed |
| Contact input/spam-protection unit tests | 5 passed |
| Browser tests against the production server | 10 passed |
| Automated WCAG AA checks | Passed in all five themes |
| Responsive layout / horizontal overflow | Passed at 360, 768, 1024, 1440, 3840 pixels |
| Case studies, PDF download, filters, CSV export, theme persistence, command menu, mobile drawer | Passed |
| Server rendering, hydration, canonical/social metadata, sitemap, robots, icons, HTTP 404 | Passed |

Final Lighthouse mobile audit of the local production homepage:

| Category | Score |
| --- | ---: |
| Performance | 95 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

First contentful paint: 2.3 seconds. Largest contentful paint: 2.4 seconds. Total blocking time: 30 milliseconds. Cumulative layout shift: 0.009. Scores can vary by device, network, hosting and run; this is a local simulated-mobile audit, not a guarantee for every page or device. Automated accessibility results are not a complete manual accessibility audit.

The 3D scene is a separately lazy-loaded desktop enhancement. It is skipped on mobile, reduced-motion, data-saving, and low-power configurations, and falls back when WebGL is unavailable. The build reports its large optional chunk; it is not part of the mobile audit's initial download.

Direct SMTP delivery was not tested because no provider was configured. The tested contact flow validates the message, prepares an email draft, and offers a working mailto link without claiming delivery. Calendar scheduling uses an email request; no scheduling account URL was supplied. Original dashboard screenshots/model artifacts and public project repositories were not supplied; project visuals are labeled illustrations and the live lab uses synthetic data. Optional Arabic localization is not implemented.

Configuration fields `install_script` and `start_skill` were saved to the cloud environment draft. They have not been published. No website deployment was performed.
