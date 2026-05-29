## ADDED Requirements

### Requirement: Background music playback
The system SHALL play soothing background music with basic transport controls.

#### Scenario: Music starts on user tap
- **WHEN** the user taps the play button or first interacts with the app
- **THEN** the AudioContext SHALL be initialized
- **AND** a default soothing track begins playing in a loop

#### Scenario: Play and pause toggle
- **WHEN** the user taps the play/pause button while music is playing
- **THEN** the music SHALL pause
- **WHEN** the user taps again
- **THEN** the music SHALL resume from the paused position

#### Scenario: Track selection
- **WHEN** the user selects a different track from the available list
- **THEN** the current track SHALL fade out over 1 second
- **AND** the new track SHALL fade in over 1 second and loop

#### Scenario: Volume control
- **WHEN** the user adjusts the volume slider
- **THEN** the music volume SHALL change in real-time between 0% and 100%

#### Scenario: Music player UI is minimal
- **WHEN** the user is in any scene
- **THEN** a small music control icon SHALL be visible in the top-right corner
- **AND** tapping it SHALL expand a compact player panel with play/pause, track list, and volume
