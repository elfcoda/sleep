## ADDED Requirements

### Requirement: Welcome scene aligns with the phone display viewport
The system SHALL render the welcome scene so its visible composition is centered within the usable phone display area and does not appear offset relative to the phone shell.

#### Scenario: Initial load centers welcome content
- **WHEN** the app loads on the home screen
- **THEN** the welcome title, subtitle, and decorative elements SHALL appear visually centered within the phone display viewport
- **AND** no part of the primary composition SHALL be clipped by the phone shell chrome or bottom tab bar

#### Scenario: Alignment remains correct after responsive scaling
- **WHEN** the phone frame is scaled for a smaller viewport
- **THEN** the home screen composition SHALL remain aligned to the scaled phone display area
- **AND** the visual center of the composition SHALL remain stable relative to the screen bounds
