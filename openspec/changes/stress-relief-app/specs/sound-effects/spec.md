## ADDED Requirements

### Requirement: Sound effects trigger on interaction
The system SHALL play situational sound effects when users interact with scene elements.

#### Scenario: Sound effect on cloud tear
- **WHEN** the user drags to tear a cloud in the cloud-tearing scene
- **THEN** a soft tearing or ripping sound effect SHALL play

#### Scenario: Sound effect on bubble pop
- **WHEN** the user taps a bubble in the bubble-popping scene
- **THEN** a pop sound effect SHALL play at the moment of the pop

#### Scenario: Sound effect on leaf crush
- **WHEN** the user presses and drags over leaves in the leaf-crushing scene
- **THEN** a crunching sound effect SHALL play continuously while dragging

#### Scenario: Sound effects do not overlap excessively
- **WHEN** multiple sound effects trigger rapidly (e.g., rapid bubble popping)
- **THEN** the system SHALL limit concurrent sound effect instances to 8
- **AND** older sound instances SHALL be stopped to make room for new ones

#### Scenario: Sound effect volume is adjustable
- **WHEN** the user adjusts the sound effects volume slider
- **THEN** all interaction sound effects SHALL change volume accordingly
- **AND** background music volume SHALL remain independent
