## Context

The existing prototype already renders a phone shell and routes all scenes through a shared canvas in the scene manager. The reported issues cluster around three cross-cutting areas: layout alignment in the welcome view, pointer hit-testing in scene input, and duplicated stroke rendering in the sand scene. Because these bugs span shared rendering and per-scene behavior, the implementation needs a small design pass before coding.

## Goals / Non-Goals

**Goals:**
- Ensure welcome-screen visuals are positioned relative to the actual usable phone display area rather than drifting against the shell.
- Ensure a tap on a visible bubble is interpreted in the same coordinate space used to render that bubble.
- Ensure one sand gesture produces one visible smoothing stroke with no duplicate overlay artifact.
- Add a lightweight verification path for these regressions after the fixes land.

**Non-Goals:**
- Redesign the overall visual style of the app.
- Change scene content, audio assets, or navigation patterns unrelated to the reported bugs.
- Introduce a framework, build step, or automated test harness.

## Decisions

### 1. Treat the scene container as the single source of truth for layout and input coordinates
The scene manager already owns canvas sizing and pointer mapping, so fixes should preserve that architecture instead of letting each scene invent its own offsets. The welcome scene should render against the measured scene viewport, and bubble hit-testing should be validated against the same coordinates used for rendering.

Alternative considered: hard-coded compensation offsets in individual scenes. Rejected because it hides the root cause and will break again when the phone shell or responsive scaling changes.

### 2. Fix bubble popping by normalizing tap semantics, not by widening hitboxes blindly
The bubble scene should respond to a deliberate tap event in rendered bubble coordinates. If the current pointer sequence or canvas measurement causes mismatch, that should be corrected at the event-mapping layer or by using a tap-confirmation flow, rather than increasing radii enough to mask the bug.

Alternative considered: enlarge bubble hit areas. Rejected because it can make adjacent bubbles pop unexpectedly and would not solve coordinate drift.

### 3. Render sand smoothing from one stroke model per gesture
The sand scene currently stores smoothed areas in the baked image and also draws the live drag trail on top, which risks producing the observed double-scratch effect. The fix should choose one canonical stroke representation for the active gesture, then merge it into the persistent sand state without separately duplicating the same trail.

Alternative considered: reduce line width or opacity of one layer. Rejected because it softens the symptom without removing duplicated rendering logic.

## Risks / Trade-offs

- [Layout bug is partly perceptual rather than geometric] → Validate with the actual rendered shell and welcome scene before finalizing the fix.
- [Pointer issues may vary across mouse and touch input] → Verify the fix against both click and touch-style pointer sequences through the shared scene manager.
- [Removing one sand-rendering path may change the feel of the smoothing effect] → Preserve the same stroke width and softness while consolidating to a single visual source.

## Migration Plan

- Apply the fixes in the existing frontend files only.
- Verify the three reported regressions manually in the browser.
- If any fix regresses scene behavior, revert the affected file changes; no data migration or deployment sequencing is required.

## Open Questions

- Whether the home-screen misalignment is caused purely by scene centering or also by overlay controls visually shifting the composition should be confirmed during implementation.
