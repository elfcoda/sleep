## ADDED Requirements

### Requirement: Visible bubbles pop on direct tap
The system SHALL pop a bubble when the user taps directly inside that bubble's rendered boundary.

#### Scenario: Tap pops one bubble
- **WHEN** the user taps inside the radius of an unpopped bubble
- **THEN** that bubble SHALL transition to its popped visual state
- **AND** the pop sound and particle feedback SHALL trigger once

#### Scenario: Tap uses rendered bubble coordinates
- **WHEN** the bubble scene is displayed inside the phone frame at any supported scale
- **THEN** tap hit-testing SHALL use the same coordinate space as bubble rendering
- **AND** a tap on visible bubble artwork SHALL not miss because of layout or scaling drift

#### Scenario: One tap does not pop adjacent bubbles
- **WHEN** the user taps a single unpopped bubble
- **THEN** only the targeted bubble SHALL pop
- **AND** neighboring bubbles SHALL remain unchanged
