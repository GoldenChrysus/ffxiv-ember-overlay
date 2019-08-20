# Changelog

## 0.9.0-alpha

**Released: [in development]**

*! - indicates change is available on the staging site*

### Bug Fixes
- Resolved issue where saved CSS would not appear in code editor on subsequent loads of the settings window.

### Features
- IN PROGRESS: Add setting to display total DPS in bottom right of overlay
- Added setting to show bottom of overlay when collapsed

### UI Changes
- Renamed "TPS" (Tank Per Second) to "DTPS" (Damage Taken Per Second)
- Changed blur intensity when blurring player names

### Code Changes
- ?

### Miscellaneous
- ?

## 0.8.0-alpha

**Released: 2019-08-18**

### Bug Fixes
- N/A

### Features
- Added new metric "tank per second"
    - Shows damage tanked per second (TPS)
- Added graphs to the player detail view
    - Graphs display DPS, HPS, and TPS
- Added setting to move table footer row to top of table
- ON HOLD: Add setting to display total DPS in bottom right of overlay
- ON HOLD: Add setting to show bottom of overlay when collapsed

### UI Changes
- Added "View Encounter Detail" to right-click menu

### Code Changes
- Added `lodash.mergewith` to customize the way arrays are merged for settings

### Miscellaneous
- Update sample data to add history data for charts

## 0.7.0-alpha

**Released: 2019-08-11**

### Bug Fixes
- Resolved issue where table summation did not work for some regions
- Resolved issue where changing multiple settings simultaneously wouldn't update all settings

### Features
- Added settings import/export
    - To export, open the settings window, navigate to the "Export" page, and copy the export key
    - To import, right click on the overlay, choose "Import," and paste the exported key
- Added streamers panel at Settings > Streamers
    - If streamers are live, only live streamers are featured
    - If all streamers are offline, all streamers are featured
    - Streamer display order is random for fairness
- Added light theme
    - Setting to enable is located at Settings > Interface > "Use Light Theme"

### UI Changes
- Right-click menu is now more organized with group dividers

### Code Changes
- Added `lodash.shuffle` as a convenient Fisher-Yates shuffle implementation
    - Used to shuffle the streamer list for fair, random display orders
- Added LESS functions file at `/src/styles/functions/common.less` to support theme-specific CSS
- Refactored several LESS files within `/src/styles/components`

### Miscellaneous
- N/A

## 0.6.0-alpha

**Released: 2019-08-04**

### Bug Fixes
- Long-pressing left click will no longer trigger the context menu
- Numbers for max hit/heal in certain regions will no longer result in "NaN"
- Changelog sections will no longer display in "About" if they contain no changes

### Features
- Added button to toggle collapsed state
- Added setting to make overlay collapse downwards
- Added settings to change player names to short names
- Added setting for overlay zoom
- Overlay can be minimized in the bottom corners

### UI Changes
- Changed player table "CH DH %" header to "CDH %" for critical direct hits
- Moved minimize buttons to the corners of the overlay
- Added tooltips on hover to all icon buttons to make their purpose clearer
- Made settings page accessible from right-click menu
- Converted custom CSS input box to a code input box
- Encounter time is now listed at the beginning of the encounter info
- Encounters titled "Encounter" will simply list the zone name rather than displaying "Encounter" first

### Code Changes
- Added `react-tooltip` package for icon button tooltips
- Added `react-simple-code-editor` package to convert CSS textarea to styled code input

### Miscellaneous
- Added staging site info to README

## 0.5.0-alpha

**Released: 2019-07-28**

### Bug Fixes
- N/A

### Features
- Adding settings system
    - Overlay will remember which tab user was viewing and if they had the overlay collapsed
    - User can specify the opacity (transparency) of the overlay
    - User can specify if their party rank should display in the top-right corner
    - For each table tab, the user can specify the columns that appear, default sorting, and whether the footer row shows
    - For the player detail, the user can specify the metrics that appear for each role type
    - For the raid view, the user can specify the default sorting and the metrics that appear for each role type
    - User can blur other players' names (eye icon in bottom right of overlay)
    - User can provide custom CSS that will affect the overlay
        - Will not affect settings page
- Updated sample data to eight players instead of four

### UI Changes
- N/A

### Code Changes
- Added middleware to Redux store to listen for state changes from other instances of the same session
    - For syncing setting changes from the settings interface to the active overlay
- Added `semantic-ui-less` and `semantic-ui-react`
- Refactored all CSS colors into LESS variables for future light theme
- Added `changelog-parser` to help auto-create user-friendly changelogs based on user's last version
- Added some `lodash` packages for easier state management
- Added `jquery-ui` package for slider
- Added `compare-versions` to perform version comparison logic
- Refactored lots of code

### Miscellaneous
- N/A

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