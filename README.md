# FFXIV Ember Overlay
React overlay for the [OverlayPlugin](https://github.com/hibiyasleep/OverlayPlugin/releases) and [ACTWebSocket](https://github.com/ZCube/ACTWebSocket) plugins for [Advanced Combat Tracker](https://advancedcombattracker.com/download.php) for use with Final Fantasy XIV.

[![GitHub](https://img.shields.io/github/license/GoldenChrysus/ffxiv-ember-overlay.svg?style=flat-square)](https://github.com/GoldenChrysus/ffxiv-ember-overlay/blob/master/LICENSE)
![GitHub package.json version](https://img.shields.io/github/package-json/v/GoldenChrysus/ffxiv-ember-overlay.svg?style=flat-square)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/GoldenChrysus/ffxiv-ember-overlay/bleeding-edge.svg?style=flat-square)
[![Works with OverlayPlugin](https://img.shields.io/badge/works%20with-OverlayPlugin-blue.svg?style=flat-square)](https://github.com/ngld/OverlayPlugin)
[![Works with ACTWebSocket](https://img.shields.io/badge/works%20with-ACTWebSocket-blue.svg?style=flat-square)](https://github.com/ZCube/ACTWebSocket)
[![Discord](https://img.shields.io/discord/603399999723929600.svg?style=flat-square&logo=discord)](https://discord.io/emberoverlay)
![GitHub package.json dynamic](https://img.shields.io/github/package-json/keywords/GoldenChrysus/ffxiv-ember-overlay.svg?style=flat-square)

#### Funding
<a href="https://paypal.me/goldenchrysus"><img src="https://i.imgur.com/ugzarwk.png" alt="Donate at PayPal" height="23"></a>
<a href="https://ko-fi.com/S6S611OOG"><img src="https://www.ko-fi.com/img/githubbutton_sm.svg" alt="Donate at Ko-fi" height="23"></a>
<a href="https://patreon.com/Chrysus"><img src="https://i.imgur.com/cjMRY6Q.png" alt="Become a Patron" height="23"></a>
<a href="https://streamelements.com/chrysus/tip"><img src="https://img.shields.io/badge/Donate-at%20StreamElements-green" alt="Donate at StreamElements" height="23"></a>

## Usage with OverlayPlugin
Set your OverlayPlugin URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/

## Usage with ACTWebSocket with OverlayProc
Add a new skin URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/ and create a new overlay window from this skin.

## Discord
Join the Discord server to receive live updates, report bugs, or request features at: [https://discord.io/emberoverlay](https://discord.io/emberoverlay)

## Features
### Informative tabs for damage, healing, tanking, and raiding.
![DPS tab](https://i.imgur.com/3PAshNq.png "DPS tab")
![Healing tab](https://i.imgur.com/jOnlhE5.png "Healing tab")
![Tanking tab](https://i.imgur.com/m3LrYDg.png "Tanking tab")
![Raid tab](https://i.imgur.com/x0x6a7A.png "Raid tab")

### Click on any player's name to view detailed statistics.
![Detailed statistics](https://i.imgur.com/Hslset9.gif "Detailed statistics")

### Customize your experience.
![Customizable overlay](https://i.imgur.com/BvZqnNV.gif "Customizable overlay")

### Collapsible interface to save space and show only your stats.
![Collapsible interface](https://i.imgur.com/NI8lenF.gif "Collapsible interface")

### Minimize the entire overlay to the left or right when not in use to free up screen space.
![Minimize when not in use](https://i.imgur.com/ljo44Se.gif "Minimize when not in use")

### Easily see the recent changes since your last visit
![About and changelog](https://i.imgur.com/dMesiHs.gif "About and changelog")

### Clear encounter data or load sample data to perfect your setup.
![Clear encounter and load sample data](https://i.imgur.com/MkmkyLm.gif "Clear encounter and load sample data")

## Installation

#### Other Languages Available

   - [日本語でOnlinegaming.life](https://onlinegaming.life/ff14/ember-overlay/)

To use this overlay skin, you need Advanced Combat Tracker (ACT) and OverlayPlugin. Please follow the guide based on your situation:

### You don't have ACT or OverlayPlugin

Please follow [the ACT + OverlayPlugin installation guide](https://github.com/GoldenChrysus/ffxiv-ember-overlay/blob/bleeding-edge/ACT_INSTALLATION.md) from the beginning.

### You already have ACT but need OverlayPlugin

Please follow [the OverlayPlugin installation guide](https://github.com/GoldenChrysus/ffxiv-ember-overlay/blob/bleeding-edge/ACT_INSTALLATION.md#installing-overlayplugin).

### You already have ACT and OverlayPlugin

Choose the guide based on your version of OverlayPlugin:

#### ngld OverlayPlugin

1. Within ACT, navigate to Plugins > OverlayPlugin.dll.
2. Set your overlay URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/ or add a new overlay with the Ember preset selected (presets available in ngld OverlayPlugin 0.13.0 or later).

#### hibiyasleep or RainbowMage OverlayPlugin

1. Within ACT, navigate to Plugins > OverlayPlugin.dll > Mini Parse.
2. Set the URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/
3. Click "Reload overlay," and the overlay should now be visible in your FFXIV game.

### Older Guides (ACTWebSocket and 0.3.4.0 OverlayPlugin)

If you need to see the old ACTWebSocket or 0.3.4.0 OverlayPlugin guides, they can be accessed [here](https://github.com/GoldenChrysus/ffxiv-ember-overlay/tree/0.15.0-alpha#installation).

## Changelog

View the full changelog [here](/CHANGELOG.md).

## Staging Site

You can access and test features in advance by using the staging site. Instead of the regular URL, set your overlay to https://goldenchrysus.github.io/ffxiv/ember-overlay-dev/

Please note that the staging site is for pre-release testing, so you may encounter errors. Please report these errors as GitHub issues or in the #bug-reports channel on the [Discord](https://discord.io/emberoverlay).

When viewing the [changelog](/CHANGELOG.md), you will be able to determine which changes are available on the staging site because they will be prefixed with "!" in the changelog for the latest development version.

## Credits

### Translations

- **Bona** - Portuguese
- [**ShadyWhite**](https://github.com/ShadyWhite) - Chinese
- **Gusma** - Portuguese
- **The_X** - Portuguese
- **okuRaku** - [Twitter](https://twitter.com/okurakuu), [Twitch](https://www.twitch.tv/okuraku)  - Japanese
- **Astriel** - German
- **Claud** - Spanish
- **Okâme** - French

### Donors

- Amneamnius
- Vulasuw

### Misc.

- [canisminor1990/ffxiv-cmskin](https://github.com/canisminor1990/ffxiv-cmskin) - CSS styling

## Building
To build this yourself, do the following:

1. Clone the repository using git, e.g. `git clone https://github.com/GoldenChrysus/ffxiv-ember-overlay.git`
    - If new to or unfamiliar with git, reference GitHub's article on [cloning a repository](https://help.github.com/en/articles/cloning-a-repository).
    - Alternatively, you can [download the ZIP file](https://github.com/GoldenChrysus/ffxiv-ember-overlay/archive/bleeding-edge.zip) for the repository.
2. Run `npm install` to install the Node packages.
3. Make a file `.env-cmdrc` and provide environment variables as necessary, using `.env-cmdrc.sample` as a guide.
4. To launch the server immediately:
    1. Run `npm start` to start the React app on your machine on port 3000.
    2. Navigate to your.server.host:3000 to view the app.
    
5. To build the app for usage on a Web server:
    1. Run one of the following build commands depending on your environment:
        - `npm run build:development` to build the development environment.
        - `npm run build:staging` to build the staging environment.
        - `npm run build` to build the production environment.
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

## License
[GNU General Public License v3.0 only](/LICENSE)

## Copyright
Copyright (C) 2019-2020, Patrick Golden. All rights reserved.

Copyrights licensed under GNU General Public License v3.0 only.

See the accompanying [LICENSE](/LICENSE) file for terms.
