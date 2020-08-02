# Changelog

## 0.20.2-alpha

**Released: [in development]**

*! - indicates change is available on the staging site*

### Bug Fixes
- ?

### Features
- ?

### UI Changes
- Made performance bar backgrounds slightly lighter in the light theme

### Code Changes
- ?

### Miscellaneous
- Updated sample data
- Updated README feature images

## 0.20.1-alpha

**Released: 2020-08-01**

### Bug Fixes
- Fixed issue where max DPS is sometimes not registered correctly due to incorrect data types

### Features
- N/A

### UI Changes
- N/A

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.20.0-alpha

**Released: 2020-07-26**

### Bug Fixes
- Fixed issue where rank was higher than it should be if player is in last place
- Fixed issue with overlay crashing in some cases when an monster's target had not yet been processed in the combatant tables

### Features
- Added new player metric: Max Damage Per Second
    - "Max Damage Per Second" is each combatant's ongoing max recorded DPS after at least 30 seconds have elapsed in the encounter
- Added pet and companion support
    - Pets and companions will appear below the main player table
    - Each pet or companion counts towards the overall combatant count
    - Your combatant rank/performance is based on your character's DPS/HPS/etc. not the DPS/HPS/etc. of your pets or companions
    - This functionality is directly tied to the ACT setting located at Plugins > FFXIV Settings > Disable Combine Pets with Owner
        - Ember does not provide any pet merging functionality outside of the standard ACT merging functionality

### UI Changes
- N/A

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.19.0-alpha

**Released: 2020-07-19**

### Bug Fixes
- Fixed issue with Twitch streamers list not loading in settings menu

### Features
- Added new player metrics: Heal Count, Shields, and Parry %.
    - "Heal Count" is the number of heals (not the health value of heals) casted
    - "Shields" is health value of shielding casted
    - "Parry %" is the frequency of parrying, similar to "Block %"

### UI Changes
- Renamed "Select All" in Settings > Export to "Copy" -- button now automatically initiates a copy of all of the export text

### Code Changes
- N/A

### Miscellaneous
- Added welcome message in OverlayPlugin logs

## 0.18.0-alpha

**Released: 2020-07-05**

### Bug Fixes
- N/A

### Features
- Added minimal theme
    - Enable the minimal theme in Settings > Interface > Theme

### UI Changes
- Shortened English "Death" table title to "Dth"

### Code Changes
- Added `data-role` attribute (enum: `dps`, `heal`, `tank`) to player row `<div>` for easier role-wide CSS styling

### Miscellaneous
- Reorganized "Interface" settings section

## 0.17.0-alpha

**Released: 2020-06-07**

### Bug Fixes
- N/A

### Features
- Added encounter history
    - Encounter history can be accessed by clicking the rewind clock icon in the bottom-right of the overlay
    - Up to five encounters will be stored at a time, including the active encounter
    - If viewing a previous encounter while in an active encounter, the previous encounter will continue to display until the user manually switches back to the active encounter
        - Active encounter will continue to accurately parse in the background when viewing a previous encounter
    - Previous encounters store: table data, player detail (including graphs), enmity data, and the aggro list

### UI Changes
- Renamed "Aggro" tab to "Agg" to save space

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.16.0-alpha

**Released: 2020-05-30**

### Bug Fixes
- Fixed 404 error for resize handle image

### Features
- Added enmity and aggro data for ngld OverlayPlugin users
    - Added "Enmity" metric to table and detail settings
    - "Aggro" tab automatically available for ngld OverlayPlugin users
- TODO: Add "copy" and "paste" buttons for exporting/importing settings data

### UI Changes
- New-version indicator (colored gear) will no longer trigger when overlay is running in OBS

### Code Changes
- `/src/data/locales/metrics.json` renamed to `player-metrics.json`
- `/src/data/locales/monster-metrics.json` added
- `/src/processors/SocketMessageProcessor.js` renamed to `MessageProcessor.js`
- Modified `/src/services/PluginService.js` to utilize the aforementioned `MessageProcessor`

### Miscellaneous
- N/A

## 0.15.3-alpha

**Released: 2020-02-09**

### Bug Fixes
- N/A

### Features
- N/A

### UI Changes
- Updated translations for Portuguese and Japanese

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.15.2-alpha

**Released: 2020-01-26**

### Bug Fixes
- Fixed issue causing DPS, HPS, damage taken, heals taken, and deaths to not always sum in the table footer depending on which overlay tab was active

### Features
- N/A

### UI Changes
- N/A

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.15.1-alpha

**Released: 2020-01-15**

### Bug Fixes
- N/A

### Features
- Added better support for ngld OverlayPlugin Web sockets
    - Alternative URL for Ember Overlay is `http://http.chrysus.xyz/ffxiv/ember-overlay/`
    - Users on ngld OverlayPlugin using Web sockets will automatically redirect to this URL; no plugin setup changes are necessary

### UI Changes
- N/A

### Code Changes
- Added redirect to non-SSL site for Web socket users on ngld OverlayPlugin
- Added build variants `nonssl` and `nonssl-staging` for building the non-SSL site code
    - `npm run build:nonssl`
    - `npm run build:nonssl-staging`

### Miscellaneous
- Created new ACT/OverlayPlugin installation guide

## 0.15.0-alpha

**Released: 2020-01-12**

### Bug Fixes
- N/A

### Features
- Added setting page to rename metrics
    - Accessible at Settings > Metric Names
    - Add new metric name by choosing an existing metric, entering custom names, and clicking "Add"
    - Custom names can be deleted by clicking "Delete" on the row
    - Must click "Save" for your custom names to update

### UI Changes
- N/A

### Code Changes
- N/A

### Miscellaneous
- Added PayPal donation option
- Corrected changelogs for previous versions

## 0.14.0-alpha

**Released: 2019-12-23**

### Bug Fixes
- N/A

### Features
- Added setting to auto-hide the overlay after a period of inactivity
    - The method for calculating inactivity is subject to change; please report issues in the Discord

### UI Changes
- N/A

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.13.0-alpha

**Released: 2019-12-01**

### Bug Fixes
- Resolved issue where imported settings would sometimes not save

### Features
- N/A

### UI Changes
- Added French and Spanish translations
- Fixed some translation errors
- Updated some translation items for all languages

### Code Changes
- N/A

### Miscellaneous
- Corrected changelogs for previous versions

## 0.12.1-alpha

**Released: 2019-11-04**

### Bug Fixes
- Resolved issue where encounter history graph would reset after 100 seconds

### Features
- N/A

### UI Changes
- Updated some translations for Chinese

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.12.0-alpha

**Released: 2019-09-29**

### Bug Fixes
- Resolved issue where decimal accuracy of 0 would not be saved

### Features
- Added setting to blur job icons when blurring player names

### UI Changes
- Updated some translations for Chinese

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.11.0-alpha

**Released: 2019-09-15**

### Bug Fixes
- N/A

### Features
- Added setting to specify decimal accuracy (0, 1, or 2 - default)
- Added setting to shorten thousands to "K"

### UI Changes
- N/A

### Code Changes
- N/A

### Miscellaneous
- N/A

## 0.10.0-alpha

**Released: 2019-09-02**

### Bug Fixes
- Resolved issue where custom CSS code editor wouldn't expand vertically to accommodate several lines of CSS
- HOTFIX: Resolved issue where overlay would instantiate infinite WebSocket clients, causing high CPU usage on some machines
- Resolved issue where the overlay couldn't be collapsed as normal upon first load before an encounter had begun

### Features
- Added translation system
    - Languages
        - Português
        - 中文
        - 日本語
        - Deutsch
    - To do:
        - README
        - Changelogs
        - Donation page
        - New text added since the translation process began

### UI Changes
- Removed decimals from death metric

### Code Changes
- Added translation data at `/src/data/locales/*.json`
- Translations are generated by new service at `/src/services/LocalizationService.js`
- Added `react-string-replace` to help dynamically replace placeholder text in translation templates with React components

### Miscellaneous
- Added credits to "About" and "Donate" pages in settings

## 0.9.0-alpha

**Released: 2019-08-25**

### Bug Fixes
- Resolved issue where saved CSS would not appear in code editor on subsequent loads of the settings window
- HOTFIX: Resolved issue where calculating effective healing metrics may cause an error

### Features
- Added setting to display total DPS (rDPS) in overlay footer
- Added setting to show overlay footer when collapsed
- Added setting to show performance background bars
- Added setting to specify current player's name
- Converted on/off player name shortening setting to setting with four options
    - Options are: No shortening, First L., F. Last, and F. L.

### UI Changes
- Renamed "TPS" (Tank Per Second) to "DTPS" (Damage Taken Per Second)
- Changed blur intensity when blurring player names
- Added value indicator to settings sliders
- Added donation info to overlay startup screen and settings window

### Code Changes
- Added migration system to convert old data to new data
    - File structure is as follows:
        - `/src/constants/Migrations.js` lists the available migrations in order of creation
        - `/src/migrations/*` contains each migration file and its logic
        - `/src/services/MigrationService.js` handles running any pending migrations
    - Migration process is initiated from `/src/index.js`
- Implemented scaling reconnect delay when a connection to ACTWebSocket fails or closes

### Miscellaneous
- Updated README with OverlayPlugin version requirement
- Updated README with ACTWebSocket version requirement

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
