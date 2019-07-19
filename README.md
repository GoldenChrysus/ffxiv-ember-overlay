# FFXIV Ember Overlay
React overlay for the [OverlayPlugin](https://github.com/hibiyasleep/OverlayPlugin/releases) and [ACTWebSocket](https://github.com/ZCube/ACTWebSocket) plugins for [Advanced Combat Tracker](https://advancedcombattracker.com/download.php) for use with Final Fantasy XIV.

[![GitHub](https://img.shields.io/github/license/GoldenChrysus/ffxiv-ember-overlay.svg)](https://github.com/GoldenChrysus/ffxiv-ember-overlay/blob/master/LICENSE)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/GoldenChrysus/ffxiv-ember-overlay/master.svg)
[![Works with OverlayPlugin](https://img.shields.io/badge/works%20with-OverlayPlugin-blue.svg)](https://github.com/hibiyasleep/OverlayPlugin)
[![Works with ACTWebSocket](https://img.shields.io/badge/works%20with-ACTWebSocket-blue.svg)](https://github.com/ZCube/ACTWebSocket)

## Usage with OverlayPlugin
Set your OverlayPlugin URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/

*WebSocket support has not yet been pushed to the above URL, but it is present in this repository.*

## Features
### Informative tabs for damage, healing, and tanking.
![DPS tab](https://i.imgur.com/iyPTQQa.png "DPS tab")
![Healing tab](https://i.imgur.com/Lq1JcVw.png "Healing tab")
![Tanking tab](https://i.imgur.com/yd7dXLe.png "Tanking tab")

### Click on any player's name to view detailed statistics.
![Detailed statistics](https://i.imgur.com/lSEnud8.gif "Detailed statistics")

### Collapsable interface to save space and show only your stats.
![Collapsable interface](https://i.imgur.com/b5UQcC6.gif "Collapsable interface")

### Clear encounter data or load sample data to perfect your setup.
![Clear encounter and load sample data](https://i.imgur.com/jImxkgU.gif "Clear encounter and load sample data")

### Minimize the entire overlay to the left or right when not in use to free up screen space.
![Minimize when not in use](https://i.imgur.com/FLhKdKH.gif "Minimize when not in use")

## Installation

### OverlayPlugin
0. If you already have Advanced Combat Tracker (ACT) and OverlayPlugin setup and configured to your liking, skip to step 3.
1. Ensure ACT and OverlayPlugin are installed and working by following [these instructions](https://gist.github.com/TomRichter/e044a3dff5c50024cf514ffb20a201a9).
2. Within ACT, navigate to Plugins > OverlayPlugin.dll > Mini Parse.
3. Set the URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/
4. Click "Reload overlay," and the overlay should now be visible in your FFXIV game.

### ACTWebSocket
0. If you already have Advanced Combat Tracker (ACT), ACTWebSocket, and OverlayProc setup and configured to your liking, skip to step 15.
1. Ensure ACT is installed and working by following [these instructions](https://gist.github.com/TomRichter/e044a3dff5c50024cf514ffb20a201a9).
2. Within ACT, navigate to Plugins > Plugin Listing.
3. Delete the "FFXIV_ACT_Plugin.dll" entry by clicking the "X" in the top right of the entry.
4. Download ACTWebSocket and OverlayProc from [here](https://github.com/GoldenChrysus/ffxiv-ember-overlay/raw/master/act/ACTWebSocket.zip).
5. Before unzipping the previous file, ensure it is unblocked by right-clicking the file, choosing "Properties," and clicking "Unblock" at the bottom of the "General" tab.
    - If the unblock option is not available at this stage, repeat this process for the ACTWebSocket.dll file after extracting in the next step.
6. Extra the ZIP file to the location of your choosing.
7. Within ACT, navigate to Plugins > Plugin Listing > Browse, and choose the ACTWebSocket.dll file from the extracted ZIP file.
8. Navigate to Options > Show Startup Wizard, and follow the same process you used in step 1 to setup ACT. This will add the FFXIV_ACT_Plugin.dll that was removed in step 3.
9. Navigate to Plugins > ACTWebSocket, and use the following configuration under "Start Options":
    - Server Auto Start: checked
    - Use UPNP: unchecked
    - Use SSL: unchecked
    - random URL: unchecked
    - Skin Dir on Act/OverlaySkin: checked
    - Use MobileProc Discovery: unchecked
    - Update Plugin Address: checked
10. Use the following configuration under "Host":
    - Host: either the top-most option or "127.0.0.1"
    - Port: 10501
    - UPNP Port: 10501
11. Use the following configuration under "Message Filter":
    - Use Miniparse Data: checked
    - Using OnLogLineRead: unchecked
    - Using BeforeLogLineRead: unchecked
    - Using Chat: unchecked
12. Under "Server Status," click "On."
13. In the middle of the screen, ensure you are on the tab entitled "HTML Based."
14. Use the following configuration under "OverlayProc":
    - OverlayProc Auto Start: checked
    - In the drodpown (the only dropdown in this section), choose "x64_QT5.8.0" if on a 64-bit system or "x86_QT5.8.0" if on a 32-bit system.
    - If the textbox to the right of the dropdown has text beginning with "0.0.0" then click "Download."
15. In the section entitled "Web Skins," click "Add URL."
16. Enter https://goldenchrysus.github.io/ffxiv/ember-overlay/ and click "Ok."
17. In the section entitled "OverlayProc," click "Start/Stop OverlayProc."
18. Click "Open Manager."
19. In the section entitled "Overlay List," double click "Ember Overlay" _or_ select "Ember Overlay" and click "New." It should then appear in the section entitled "Overlay Windows" and should be visible in your FFXIV game.

## Building
To build this yourself, do the following:

1. Clone the repository using git, e.g. `git clone https://github.com/GoldenChrysus/ffxiv-ember-overlay.git`
    - If new to or unfamiliar with git, reference GitHub's article on [cloning a repository](https://help.github.com/en/articles/cloning-a-repository).
    - Alternatively, you can [download the ZIP file](https://github.com/GoldenChrysus/ffxiv-ember-overlay/archive/master.zip) for the repository.
2. Add a property `homepage` to package.json if you intend to host the app on a Web server and not at the root directory.
    - e.g. `"homepage": "https://username.github.io/path/to/app"`
3. To launch the server immediately:
    1. Run `npm start` to start the React app on your machine on port 3000.
    2. Navigate to your.server.host:3000 to view the app.
    
4. To build the app for usage on a Web server:
    1. Run `npm run build` to build the files to the `/build` directory.
    2. Copy the contents of `/build` to the desired path on your Web server.
    3. Navigate to your.server.host/path/to/app to view the app.

## Contributing

### Process

1. Create a fork.
2. Make your changes and follow the coding guidelines.
3. Commit with meaningful messages that describe your changes.
4. Create a pull request.
5. Ensure your pull request describes the nature and purpose of your changes.

### Coding Guidelines
This list is not exhaustive and generally applies to formatting. Your merge request may be rejected for other reasons including but not limited to: formatting issues not specified here, architectural concerns, or functionality concerns.

- Indentation must use tabs.
- Variable assignment equal signs should be aligned using spaces.
- Use `let` for all variable declarations unless unreasonable (e.g. `var` for scoping reasons or `const` for constants).
- Variable comparisons should use `===`.
- Variable names should be descriptive and not misspelled.
- Variable names should be snake_case.
- Function names should be camelCase.
- Class names should be PascalCase.
- String quotation should be done with double-quotes, not single-quotes, except in cases of interpolation where backticks would be used.
- Trailing whitespace should be stripped.
- Do not refactor surrounding code unless necessary for your change.
- `return` statements should be as early or late in a function as possible; avoid `return` statements in the middle of a function.
- Opening curly braces (`{`) for classes, functions, and control blocks should be on the same line as the block, e.g. `if (some_var === true) {`.
- Use arrow functions unless needing to inherit the class or function context.
- Ensure the final version of your code is free of debug code.

## Credits

- [canisminor1990/ffxiv-cmskin](https://github.com/canisminor1990/ffxiv-cmskin) - for CSS styling.

## License
[GNU General Public License v3.0 only](/LICENSE)

## Copyright
Copyright (C) 2019, Patrick Golden. All rights reserved.

Copyrights licensed under GNU General Public License v3.0 only.

See the accompanying [LICENSE](/LICENSE) file for terms.
