## ADDED Requirements

### Requirement: Cloud tearing scene
The system SHALL provide a cloud-tearing interactive scene.

#### Scenario: Cloud renders on canvas
- **WHEN** the user navigates to the cloud-tearing scene
- **THEN** one or more fluffy cloud shapes SHALL render on a sky-blue background canvas

#### Scenario: Tearing a cloud apart
- **WHEN** the user touches a cloud and drags in opposite directions (two-finger or sequential drag)
- **THEN** the cloud SHALL visually tear apart along the drag path
- **AND** torn pieces SHALL drift away and fade out
- **AND** a tearing sound effect SHALL play

#### Scenario: New cloud appears after tear
- **WHEN** a cloud has been fully torn apart
- **THEN** a new cloud SHALL regenerate from the edges within 2 seconds

### Requirement: Bubble popping scene
The system SHALL provide a bubble-wrap-popping interactive scene.

#### Scenario: Bubbles render in a grid
- **WHEN** the user navigates to the bubble-popping scene
- **THEN** a grid of bubble-wrap-style circles SHALL render on the canvas
- **AND** each bubble SHALL have a slight 3D appearance with highlight

#### Scenario: Popping a bubble
- **WHEN** the user taps or clicks on a bubble
- **THEN** the bubble SHALL visually deflate with a pop animation
- **AND** a pop sound effect SHALL play
- **AND** the popped state SHALL persist visually (flat, dimmed)

#### Scenario: Reset bubble wrap
- **WHEN** all bubbles have been popped
- **THEN** a "pop all over again?" prompt SHALL appear
- **AND** tapping it SHALL reset all bubbles to unpopped state

### Requirement: Leaf crushing scene
The system SHALL provide a leaf-crushing interactive scene.

#### Scenario: Leaves render scattered
- **WHEN** the user navigates to the leaf-crushing scene
- **THEN** multiple autumn leaf shapes SHALL render scattered across the canvas on a ground-like background

#### Scenario: Crushing leaves by dragging
- **WHEN** the user drags their finger/mouse over leaves
- **THEN** leaves under the drag path SHALL visually crumble into small fragments
- **AND** a crunching sound effect SHALL play
- **AND** crushed leaves SHALL not regenerate during the session

#### Scenario: Crush progress feedback
- **WHEN** the user crushes leaves
- **THEN** a subtle progress indicator SHALL show how many leaves remain

### Requirement: Sand smoothing scene
The system SHALL provide a sand-smoothing interactive scene.

#### Scenario: Sand texture renders
- **WHEN** the user navigates to the sand-smoothing scene
- **THEN** a textured sand surface SHALL render on the canvas with subtle grain and ripple patterns

#### Scenario: Smoothing sand by swiping
- **WHEN** the user drags across the sand surface
- **THEN** the sand SHALL visually smooth along the drag path, removing ripples
- **AND** a soft sweeping sound effect SHALL play
- **AND** smoothed areas SHALL have a slightly different shade indicating they've been touched

#### Scenario: Sand gradually resets
- **WHEN** the user stops interacting for 5 seconds
- **THEN** subtle ripples SHALL slowly reappear, encouraging continued interaction

### Requirement: Visual and haptic-like feedback
The system SHALL provide satisfying visual feedback for all interactions.

#### Scenario: Particle effects on interaction
- **WHEN** the user performs any destructive interaction (tear, pop, crush)
- **THEN** small particle effects SHALL spawn from the interaction point
- **AND** particles SHALL have appropriate colors for the scene context

#### Scenario: Screen shake on strong interactions
- **WHEN** the user performs a particularly forceful interaction (fast drag, multi-touch tear)
- **THEN** the phone frame SHALL briefly shake via CSS transform for tactile feedback
