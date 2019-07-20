# Changelog

## 0.2.0-alpha

**Released: ?**

### Bugs
- Prevent cursor from changing to a text cursor when hovering over text in an OverlayProc overlay
- Correct issues presented by React console errors

### Features
- ?

### UI Adjustments
- ?

### Code
- Implement `react-router-dom` route matching in order to support planned settings dialog
- Restructure file tree of the `Parser` component

### Miscellaneous
- Semantic versioning

## 0.1.2-alpha

**Released: 2019-07-19**

### Bugs
- IN PROGRESS: Inconsistent number formatting for certain regions

### Features
- Navigation footer will not be shown in collapsed mode

### UI Adjustments
- Removed title bar
- Removed italics from encounter info bar
    - Encounter info is now prefixed with "Inactive:" when the encounter is inactive
- Made "DPS," "Heal," and "Tank," buttons at bottom of overlay smaller

### Code
- Changed some component file tree organization
- Defined build environment variables in `.env-cmdrc`
- Modified build commands to accommodate production and development build enviroments

### Miscellaneous
- Added changelog
- Added changelog info to readme
- Updated README build steps