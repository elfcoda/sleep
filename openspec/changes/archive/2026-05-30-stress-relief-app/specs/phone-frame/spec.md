## ADDED Requirements

### Requirement: Phone frame container
The system SHALL render the app within a phone-shaped container that simulates a mobile device.

#### Scenario: Phone frame renders at correct dimensions
- **WHEN** the page loads
- **THEN** a phone frame is displayed at 375×812 CSS pixels (iPhone X proportions)
- **AND** the frame includes rounded corners, a top notch area, and a bottom home indicator

#### Scenario: Phone frame scales on smaller screens
- **WHEN** the browser viewport is smaller than the phone frame dimensions
- **THEN** the phone frame SHALL scale down proportionally via CSS transform
- **AND** remain centered both horizontally and vertically

#### Scenario: Phone frame has device-like appearance
- **WHEN** the user views the app
- **THEN** the phone frame SHALL have a dark bezel, rounded screen edges, and subtle shadow
- **AND** the app content renders inside the screen area of the frame
