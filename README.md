# FFXIV Ember Overlay
React overlay for the [OverlayPlugin add-on](https://github.com/hibiyasleep/OverlayPlugin/releases) for [Advanced Combat Tracker](https://advancedcombattracker.com/download.php) for use with Final Fantasy XIV.

[![GitHub](https://img.shields.io/github/license/GoldenChrysus/ffxiv-ember-overlay.svg)](https://github.com/GoldenChrysus/ffxiv-ember-overlay/blob/master/LICENSE)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/GoldenChrysus/ffxiv-ember-overlay/master.svg)
[![Works with OverlayPlugin](https://img.shields.io/badge/Works%20With-OverlayPlugin-blue.svg)](https://github.com/hibiyasleep/OverlayPlugin)

## Usage with OverlayPlugin
Set your OverlayPlugin URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/

## Features
Information coming soon!

## Installation
1. Ensure Advanced Combat Tracker (ACT) and OverlayPlugin are installed and working by following [these instructions](https://gist.github.com/TomRichter/e044a3dff5c50024cf514ffb20a201a9).
2. Within ACT, navigate to Plugins > OverlayPlugin.dll > Mini Parse.
3. Set the URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/
4. Click "Reload overlay."

## Building
To build this yourself, do the following:

1. Checkout the repository using git, e.g. `git clone https://github.com/GoldenChrysus/ffxiv-ember-overlay.git`

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

## License
[GPL-3.0](/LICENSE)
