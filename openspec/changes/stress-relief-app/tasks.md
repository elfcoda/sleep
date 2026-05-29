## 1. Project Setup & Phone Frame

- [ ] 1.1 Create project structure: `index.html`, `css/style.css`, `js/main.js`, `js/` subdirectories
- [ ] 1.2 Build HTML shell with phone frame container, screen area, and bottom tab bar placeholder
- [ ] 1.3 Style phone frame: 375×812 dimensions, rounded corners, dark bezel, notch, home indicator, centered on page with shadow
- [ ] 1.4 Add responsive scaling so phone frame fits within smaller viewports

## 2. Audio System

- [ ] 2.1 Create `js/audio.js` module: AudioContext initialization on first user gesture, master gain control
- [ ] 2.2 Implement background music player: load tracks, play/pause, track switching with crossfade, loop
- [ ] 2.3 Implement sound effects engine: load one-shot sounds, playback with concurrency limit (max 8), volume control
- [ ] 2.4 Create music player UI: compact toggle icon in top-right, expandable panel with play/pause, track list, volume slider

## 3. Scene Management & Navigation

- [ ] 3.1 Create `js/scene-manager.js`: Scene lifecycle (init/update/render/handleInput/destroy), animation loop with requestAnimationFrame
- [ ] 3.2 Create `js/scenes/welcome.js`: Welcome scene with app title, calming animated gradient, prompt text
- [ ] 3.3 Build bottom tab bar with icons and labels: Home, Cloud Tear, Bubble Pop, Leaf Crush, Sand Smooth
- [ ] 3.4 Implement tab switching: fade transition (300ms), active tab indicator, scene lifecycle calls on switch

## 4. Interactive Scene: Cloud Tearing

- [ ] 4.1 Create `js/scenes/cloud-tear.js`: Canvas setup with sky-blue gradient background
- [ ] 4.2 Draw fluffy cloud shapes using overlapping circles/arcs with soft white/gray coloring
- [ ] 4.3 Implement tear interaction: detect drag across cloud, split cloud along drag path, animate torn pieces drifting apart and fading
- [ ] 4.4 Add cloud regeneration: new cloud fades in from edges after 2 seconds
- [ ] 4.5 Wire up tearing sound effect and particle debris on tear

## 5. Interactive Scene: Bubble Popping

- [ ] 5.1 Create `js/scenes/bubble-pop.js`: Canvas with bubble-wrap grid layout
- [ ] 5.2 Draw 3D-looking bubbles with highlight/shadow for depth
- [ ] 5.3 Implement tap-to-pop: detect tap on bubble, play deflate animation (scale down + dim), mark as popped
- [ ] 5.4 Add "pop all over again?" prompt when all bubbles are popped, with reset functionality
- [ ] 5.5 Wire up pop sound effect and particle burst on pop

## 6. Interactive Scene: Leaf Crushing

- [ ] 6.1 Create `js/scenes/leaf-crush.js`: Canvas with ground-like background
- [ ] 6.2 Draw scattered autumn leaf shapes in warm colors (orange, red, yellow)
- [ ] 6.3 Implement crush-by-drag: track drag path, detect leaf overlap, crumble leaves into fragments with animation
- [ ] 6.4 Add crunching sound effect (continuous while dragging over leaves) and progress indicator
- [ ] 6.5 Ensure crushed leaves do not regenerate during session

## 7. Interactive Scene: Sand Smoothing

- [ ] 7.1 Create `js/scenes/sand-smooth.js`: Canvas with sand-colored background, grain texture using noise
- [ ] 7.2 Draw subtle ripple/wave patterns on the sand surface
- [ ] 7.3 Implement smooth-by-swipe: drag path removes ripples, leaves smoothed trail with slightly different shade
- [ ] 7.4 Add gradual ripple regeneration after 5 seconds of inactivity
- [ ] 7.5 Wire up soft sweeping sound effect during interaction

## 8. Polish & Feedback

- [ ] 8.1 Add particle effects system: reusable particle spawner with gravity, fade, and color per scene
- [ ] 8.2 Implement screen shake on strong interactions via CSS transform on phone frame
- [ ] 8.3 Add scene transition animations (fade in/out between scenes)
- [ ] 8.4 Test touch and mouse input across all scenes, ensure consistent behavior
- [ ] 8.5 Test in Chrome, Firefox, and Safari; fix cross-browser issues
