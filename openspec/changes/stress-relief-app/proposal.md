## Why

Modern life brings constant stress, but people lack immediate, accessible tools for emotional relief. A mobile-style stress-relief app—prototyped on the web—lets users decompress anywhere through soothing audio, satisfying tactile interactions, and immersive scenarios. This prototype validates the core experience before committing to native mobile development.

## What Changes

- Build a web-based mobile phone simulator (phone-sized viewport) that mimics a stress-relief app
- Integrate a soothing background music player with curated calming tracks
- Add stress-relief sound effects (rain, wind, crackling, ASMR-style sounds) triggered by interactions
- Create interactive stress-relief scenes: tear apart clouds, pop bubble wrap, crush leaves, smooth sand, etc.
- Provide scene navigation so users can switch between different stress-relief scenarios
- All interactions include haptic-like visual/audio feedback for satisfying sensory experience

## Capabilities

### New Capabilities

- `phone-frame`: Mobile phone simulator container that renders the app at phone dimensions with device-like chrome
- `audio-player`: Background music player with play/pause, track selection, and volume control for soothing music
- `sound-effects`: Situational sound effects triggered by user interactions (tearing, popping, crushing sounds)
- `interactive-scenes`: Interactive stress-relief scenarios—cloud tearing, bubble popping, leaf crushing, sand smoothing, etc.
- `scene-navigation`: Bottom tab or carousel-based navigation to switch between stress-relief scenes

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- Pure frontend project: HTML, CSS, and vanilla JavaScript (or lightweight framework)
- No backend or API dependencies required
- Audio assets: royalty-free ambient music and sound effect files (local or CDN-hosted)
- All interactions are client-side with CSS animations and Web Audio API
