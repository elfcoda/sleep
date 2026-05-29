## ADDED Requirements

### Requirement: Bottom tab navigation
The system SHALL provide bottom tab navigation to switch between stress-relief scenes.

#### Scenario: Tab bar renders with scene icons
- **WHEN** the app loads
- **THEN** a bottom tab bar SHALL render at the bottom of the phone frame
- **AND** each tab SHALL display an icon and label for its scene
- **AND** the first scene tab SHALL be active by default

#### Scenario: Switching scenes via tab tap
- **WHEN** the user taps a tab
- **THEN** the current scene SHALL fade out over 300ms
- **AND** the selected scene SHALL fade in over 300ms
- **AND** the active tab indicator SHALL move to the tapped tab

#### Scenario: Scene state preserved during switch
- **WHEN** the user switches away from a scene and back
- **THEN** the scene SHALL restore to its initial state (reset)

#### Scenario: Tab bar always visible
- **WHEN** the user interacts with any scene
- **THEN** the tab bar SHALL remain visible and not be obscured by scene content
- **AND** the tab bar SHALL have a semi-transparent background to not distract from scenes

### Requirement: Home/welcome scene
The system SHALL provide a welcome scene as the default landing view.

#### Scenario: Welcome scene on load
- **WHEN** the app first loads
- **THEN** a welcome scene SHALL display with the app name, a calming visual (e.g., gentle animated gradient), and a subtle prompt like "choose a scene below to begin"

#### Scenario: Welcome scene accessible via tab
- **WHEN** the user taps the home tab from any other scene
- **THEN** the welcome scene SHALL display
