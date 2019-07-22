# Changelog

## 0.5.0-alpha

**Released: [in development]**

*! - indicates change is available on the staging site*

### Bug Fixes
- ?

### Features
- IN PROGRESS: Adding settings system

### UI Changes
- ?

### Code Changes
- Added `semantic-ui-less` and `semantic-ui-react`
- Refactored all CSS colors into LESS variables for future light theme

### Miscellaneous
- ?

## 0.4.0-alpha

**Released: 2019-07-21**

### Bug Fixes
- N/A

### Features
- Added 24-person overlay tab
    - Sorting is by total damage descending
    - Currently shows DPS and HPS as metrics
    - Metric types are prioritized by job role (i.e. healers display HPS before DPS)

### UI Changes
- N/A

### Code Changes
- Added `GameJobs` constant comprising job data (roles, currently) indexed by class/job key

### Miscellaneous
- Corrected changelogs for previous versions

## 0.3.0-alpha

**Released: 2019-07-20**

### Bug Fixes
- Resolved issue where encounter is always listed as inactive
- Fixed table sorting for scenarios when primary sort values for two players are equal

### Features
- Added ability to split encounter when using OverlayProc
    - Click the scissors icon in the bottom right of the overlay, or right-click and choose "Split Encounter"

### UI Changes
- Improved automatic resizing of table columns

### Code Changes
- Updated router to `HashRouter`
- Added default environment variables
    - `package.json` and `.env-cmdrc.sample` files were updated to reflect this
- Added staging environment to build options

### Miscellaneous
- Updated README

## 0.2.0-alpha

**Released: 2019-07-20**

### Bug Fixes
- Cursor will no longer change to a text cursor when hovering over text in an OverlayProc window
- Corrected issues presented by React console errors
- Resolved issue where socket disconnect would throw a JavaScript error
- Resolved issue where numbers with decimals ending in 0 may be formatted differently than other numbers
    - RESOLVES: 0.1.2-alpha bug: "Inconsistent number formatting for certain regions"

### Features
- Added ability to split encounter when using OverlayPlugin
    - Click the scissors icon in the bottom right of the overlay, or right-click and choose "Split Encounter"

### UI Changes
- Added Font Awesome icon package

### Code Changes
- Implemented `react-router-dom` route matching in order to support planned settings dialog
- Restructured file tree of the `Parser` component

### Miscellaneous
- Implemented Semantic versioning

## 0.1.2-alpha

**Released: 2019-07-19**

### Bug Fixes
- IN PROGRESS: Inconsistent number formatting for certain regions

### Features
- Navigation footer will not be shown in collapsed mode

### UI Changes
- Removed title bar
- Removed italics from encounter info bar
    - Encounter info is now prefixed with "Inactive:" when the encounter is inactive
- Made "DPS," "Heal," and "Tank" buttons at bottom of overlay smaller

### Code Changes
- Changed some component file tree organization
- Defined build environment variables in `.env-cmdrc`
- Modified build commands to accommodate production and development build enviroments

### Miscellaneous
- Added changelog
- Added changelog info to readme
- Updated README build steps