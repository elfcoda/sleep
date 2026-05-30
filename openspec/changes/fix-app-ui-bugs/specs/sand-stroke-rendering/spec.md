## ADDED Requirements

### Requirement: One gesture produces one visible sand stroke
The system SHALL render a single smoothing stroke for each continuous sand-drag gesture.

#### Scenario: Single drag shows one scratch path
- **WHEN** the user drags one pointer across the sand scene
- **THEN** the scene SHALL display one continuous smoothing path that follows the gesture
- **AND** the scene SHALL not render a second parallel or duplicated scratch for the same gesture

#### Scenario: Persistent sand state matches the gesture path
- **WHEN** the user completes a sand-smoothing drag
- **THEN** the persistent smoothed region SHALL match the stroke the user saw while dragging
- **AND** there SHALL be no extra baked trail offset from the visible gesture path

#### Scenario: Later gestures remain independent
- **WHEN** the user performs a new sand stroke after finishing a previous one
- **THEN** the new stroke SHALL render once
- **AND** previously smoothed regions SHALL remain visible until the normal reset behavior restores ripples
