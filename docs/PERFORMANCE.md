# Lag investigation and measured comparison

## Work removed

Source inspection identified several continuous costs in the old island: a shadowed WebGL scene, multiple per-frame callbacks, camera/projection updates every frame, React position updates while driving, translucent blurred overlays, scroll pinning, animated counters and pointer-following cursor updates.

The replacement removes Three.js/React Three Fiber, GSAP, Framer Motion and the extra serif font dependency. The opening chart is a small static SVG with immediate data updates. Recharts loads only after the visitor opens the dashboard, and chart animation is disabled. Scroll progress updates an isolated element only on scroll/resize; the application no longer rerenders on every scroll event.

## Controlled before/after measurement

Both local production builds were measured in headless Chromium at 1440 × 960, with a 4× CPU slowdown and software WebGL available. The browser sampled animation-frame callbacks for approximately three seconds on the opening screen after load. No other browser workload was run concurrently.

| Measurement                    | Previous 3D island | Current portfolio |
| ------------------------------ | -----------------: | ----------------: |
| Frames observed in sample      |                 31 |               182 |
| 95th-percentile frame interval |           116.6 ms |           16.7 ms |
| Frame intervals over 34 ms     |                 30 |                 0 |
| Initial encoded script bytes   |            376,346 |           100,593 |
| Initial script requests        |                  5 |                 4 |
| WebGL canvases                 |                  1 |                 0 |
| Runtime errors observed        |                  0 |                 0 |

Initial JavaScript delivery decreased by approximately **73%** in this test. The new version maintained a frame interval consistent with the test display's 60 Hz refresh rate.

This is a controlled local comparison, not a standardized INP result or a guarantee for the user's computer. Software rendering and artificial CPU throttling emphasize the old GPU/CPU workload. Frame sampling captures background contention; separate functional tests exercise the native filters, project selection and explicit dashboard loading. The previous mobile Lighthouse score covered the map fallback and did not establish 3D smoothness.
