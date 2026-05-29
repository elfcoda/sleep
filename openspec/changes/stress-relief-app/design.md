## Context

This is a greenfield project—no existing codebase. The goal is a self-contained single-page web application that simulates a mobile phone stress-relief app. Users interact within a phone-sized viewport. All assets (audio, images) will be royalty-free and bundled or CDN-hosted. The prototype must work in modern browsers with no build step.

## Goals / Non-Goals

**Goals:**
- Render a realistic phone frame at mobile dimensions (375×812 or similar)
- Play soothing background music with basic transport controls
- Trigger contextual sound effects on user interactions
- Provide at least 4 interactive stress-relief scenes with satisfying tactile feedback
- Navigate between scenes via bottom tab bar
- Work offline-capable after initial load (all assets cached)

**Non-Goals:**
- Real native mobile app (web prototype only)
- User accounts, authentication, or persistence
- Social features or sharing
- Build tooling (no bundler, no framework)
- Accessibility beyond basic keyboard support
- Internationalization

## Decisions

### 1. Vanilla HTML/CSS/JS (no framework)
**Rationale**: The app is simple enough that a framework adds overhead without benefit. Vanilla JS keeps the prototype lightweight, fast to load, and easy to iterate. If the prototype validates well, a framework (React Native / Flutter) can be chosen for the native app.

### 2. Web Audio API for sound
**Rationale**: Web Audio API provides low-latency playback, precise timing, and the ability to layer sounds. It supports `AudioContext` for background music and `AudioBufferSourceNode` for one-shot sound effects. Alternatives considered: `<audio>` elements (simpler but less control, cannot layer easily); Howler.js (good library but adds dependency for a prototype).

### 3. Phone frame via CSS container
**Rationale**: A fixed-size `<div>` with `border-radius` and device-like chrome (notch, home indicator) visually anchors the "app" concept. Responsive scaling via CSS `transform: scale()` or `vh` units keeps it centered on any screen. No iframe needed.

### 4. Canvas-based interactive scenes
**Rationale**: Interactions like tearing clouds, crushing leaves, and smoothing sand require per-pixel manipulation that DOM/CSS cannot achieve efficiently. A `<canvas>` element per scene allows drawing, animation, and hit detection. Alternatives: SVG (less performant for frame-by-frame animation); CSS-only (too limited for tear/crush effects).

### 5. Scene architecture: one canvas per scene, managed by a scene controller
**Rationale**: Each scene is a self-contained module with `init()`, `update(dt)`, `render()`, `handleInput(event)`, and `destroy()` lifecycle methods. A central `SceneManager` handles switching, cleanup, and the animation loop.

### 6. Audio assets from royalty-free sources
**Rationale**: Use freesound.org or similar CC0-licensed audio. Embed small base64 audio for essential effects; larger music files loaded asynchronously from a CDN. Avoids copyright issues and keeps the repo small.

## Risks / Trade-offs

- **Canvas performance on low-end devices**: Complex particle effects could stutter on older phones → Limit particle count, use `requestAnimationFrame` with delta-time, and throttle effects when FPS drops.
- **Audio autoplay restrictions**: Browsers block autoplay until user gesture → Require a "tap to start" flow that initializes AudioContext on first user interaction.
- **Touch vs mouse**: Canvas interactions need both touch and mouse event handling → Abstract input into normalized pointer events with unified coordinate mapping.
- **Asset loading delays**: Large audio files may lag on slow connections → Show loading state per scene; cache with Service Worker or Cache API.
