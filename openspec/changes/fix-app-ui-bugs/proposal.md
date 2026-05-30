## Why

The current web prototype has interaction regressions that break core stress-relief behaviors: the home screen does not visually align with the phone display, bubble taps do not reliably trigger popping, and sand smoothing renders duplicate scratches. These defects reduce usability and undercut the tactile quality the app depends on, so they need to be corrected before further iteration.

## What Changes

- Correct the home screen layout so welcome content is visually framed and centered within the usable phone display area.
- Fix bubble scene tap handling so a direct tap on a visible bubble consistently pops that bubble.
- Fix sand scene stroke rendering so one finger drag produces one visible smoothing stroke instead of a duplicated trail.
- Add regression coverage for scene input and display alignment behaviors to prevent these issues from reappearing.

## Capabilities

### New Capabilities
- `home-screen-alignment`: Defines how the welcome screen content must fit and remain centered inside the phone screen viewport.
- `bubble-tap-handling`: Defines reliable tap hit-testing and pop feedback for the bubble scene.
- `sand-stroke-rendering`: Defines single-stroke rendering behavior for sand smoothing interactions.

### Modified Capabilities
<!-- No existing capability specs are present in openspec/specs yet. -->

## Impact

- Affected frontend files include the phone shell layout, scene manager input mapping, and scene implementations under `js/scenes/`.
- No backend, API, or dependency changes are required.
- Testing impact is limited to browser-based interaction checks for layout and pointer behavior.
