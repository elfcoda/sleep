## 1. Diagnose Shared Layout and Input Mapping

- [x] 1.1 Inspect the scene container, canvas sizing, and pointer coordinate flow to identify the cause of the home-screen alignment and bubble tap mismatch.
- [x] 1.2 Confirm whether responsive scaling changes the relationship between rendered scene coordinates and pointer hit-testing.

## 2. Fix Home Screen Alignment

- [x] 2.1 Update the welcome-scene layout logic so the title, subtitle, and decorative elements are centered within the usable phone display viewport.
- [x] 2.2 Verify the welcome scene remains visually aligned after phone-frame scaling and does not appear clipped by shell chrome or the tab bar.

## 3. Fix Bubble Tap Handling

- [x] 3.1 Adjust bubble-scene tap handling so direct taps are interpreted in the same coordinate space used to render the bubbles.
- [x] 3.2 Verify one tap pops exactly one visible bubble and still works correctly under the supported phone-frame scales.

## 4. Fix Sand Stroke Rendering

- [x] 4.1 Refactor sand-scene stroke rendering so an active drag uses one canonical visual stroke instead of duplicated live and baked trails.
- [x] 4.2 Verify the persistent smoothed path matches the stroke shown during the gesture and that later strokes remain independent.

## 5. Regression Verification

- [x] 5.1 Manually test the home screen, bubble scene, and sand scene in the browser using both mouse-style and touch-style interaction flows.
- [x] 5.2 Recheck the affected scenes after the fixes to confirm no new regressions were introduced in scene transitions or tab navigation.
