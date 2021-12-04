# FFXIV Ember Overlay & Spell Timers
Powerful, data-focused DPS overlay and spell timers for Final Fantasy XIV. Can be used with the [OverlayPlugin](https://github.com/ngld/OverlayPlugin/releases) and [ACTWebSocket](https://github.com/ZCube/ACTWebSocket) plugins for [Advanced Combat Tracker](https://advancedcombattracker.com/download.php).

[![GitHub](https://img.shields.io/github/license/GoldenChrysus/ffxiv-ember-overlay.svg?style=flat-square)](https://github.com/GoldenChrysus/ffxiv-ember-overlay/blob/master/LICENSE)
![GitHub package.json version](https://img.shields.io/github/package-json/v/GoldenChrysus/ffxiv-ember-overlay/master.svg?style=flat-square)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/GoldenChrysus/ffxiv-ember-overlay/bleeding-edge.svg?style=flat-square)
[![Works with OverlayPlugin](https://img.shields.io/badge/works%20with-OverlayPlugin-blue.svg?style=flat-square)](https://github.com/ngld/OverlayPlugin)
[![Works with ACTWebSocket](https://img.shields.io/badge/works%20with-ACTWebSocket-blue.svg?style=flat-square)](https://github.com/ZCube/ACTWebSocket)
[![Discord](https://img.shields.io/discord/603399999723929600.svg?style=flat-square&logo=discord)](https://discord.io/emberoverlay)
![GitHub package.json dynamic](https://img.shields.io/github/package-json/keywords/GoldenChrysus/ffxiv-ember-overlay.svg?style=flat-square)

#### Funding
<a href="https://cash.app/$chrysus"><img src="https://chrysus.xyz/projects/ffxiv-ember-overlay/public/img/buttons/funding/cash.svg" alt="Donate on Cash App" height="23"></a>
<a href="https://paypal.me/goldenchrysus"><img src="https://i.imgur.com/BSwN4CJ.png" alt="Donate at PayPal" height="23"></a>
<a href="https://chrysus.xyz/paypay"><img src="https://chrysus.xyz/projects/ffxiv-ember-overlay/public/img/buttons/funding/paypay.svg" alt="ペイペイで施してください" height="23"></a>
<a href="https://ko-fi.com/S6S611OOG"><img src="https://i.imgur.com/txi1yLu.png" alt="Donate at Ko-fi" height="23"></a>
<a href="https://patreon.com/Chrysus"><img src="https://i.imgur.com/y4z22XP.png" alt="Become a Patron" height="23"></a>
<a href="https://chrysus.live/tip"><img src="https://chrysus.xyz/projects/ffxiv-ember-overlay/public/img/buttons/funding/streamlabs.svg" alt="Donate at Streamlabs" height="23"></a>

## Usage with OverlayPlugin
Create a new overlay from one of the Ember presets. Alternatively, set your OverlayPlugin URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/

## Usage with ACTWebSocket with OverlayProc
Add a new skin URL to https://goldenchrysus.github.io/ffxiv/ember-overlay/ and create a new overlay window from this skin.

## Discord
Join the Discord server to receive live updates, report bugs, or request features at: [https://discord.io/emberoverlay](https://discord.io/emberoverlay)

## Navigation
- <a href="#features">Features</a>
- <a href="#installation">Installation</a>
- <a href="#changelog">Changelog</a>
- <a href="#staging-site">Staging Site</a>
- <a href="#credits">Credits</a>
- <a href="#building">Building</a>
- <a href="#contributing">Contributing</a>
- <a href="#license">License</a>
- <a href="#copyright">Copyright</a>

## Features
### Informative tabs for damage, healing, tanking, raiding, and aggro.
![DPS tab](https://i.imgur.com/EjRWhdU.png "DPS tab")
![Healing tab](https://i.imgur.com/TxqEJ1t.png "Healing tab")
![Tanking tab](https://i.imgur.com/uMXYkyu.png "Tanking tab")
![Raid tab](https://i.imgur.com/8pKG0uC.png "Raid tab")
![Aggro tab](https://i.imgur.com/H79KkfB.png "Aggro tab")

### Click on any player's name to view detailed statistics.
![Detailed statistics](https://i.imgur.com/G3UOoFR.gif "Detailed statistics")

### Optional minimal, light, and classic themes (minimal can be combined with any theme).
![Minimal theme](https://i.imgur.com/psPV5yL.png "Minimal theme")
![Light theme](https://i.imgur.com/HJTyGqJ.png "Light theme")
![Classic theme](https://i.imgur.com/wq65hM7.png "Classic theme")

### Spell timers.
**Spell, buff, and DOT timers.**

![Spell, buff, and DOT timers](https://i.imgur.com/7qNwV06.gif "Spell, buff, and DOT timers")

**Optional minimal layout.**

![Minimal layout](https://i.imgur.com/KM1bQdr.png "Minimal layout")

**Flexible layout options.**

![Flexible layout](https://i.imgur.com/eluTIe2.png "Flexible layout")

**Powerful but easy spell timer setup.**

![Powerful but easy setup](https://i.imgur.com/z8UPg7u.png "Powerful but easy setup")

### Text to speech alerts.
![Customizable text to speech alerts](https://i.imgur.com/cMj0OJF.png "Customizable text to speech alerts")

### Powerful overlay and data settings.
![Customizable overlay](https://i.imgur.com/Kpq8ZPb.gif "Customizable overlay")

### Quality of life features.
**Collapsible interface to save space and show only your stats.**

![Collapsible interface](https://i.imgur.com/7MDEnJm.gif "Collapsible interface")

**Blur player names for privacy (optionally blur job icons).**

![Blur player names](https://i.imgur.com/AWHwZ03.gif "Blur player names")

**Browse encounter history (up to five encounters).**

![View encounter history](https://i.imgur.com/HfAq3kc.png "View encounter history")

**Minimize the entire overlay to the left or right when not in use to free up screen space.**

![Minimize when not in use](https://i.imgur.com/HSiTNCF.gif "Minimize when not in use")

### Easily see the recent changes since your last visit.
![About and changelog](https://i.imgur.com/fgZgoN4.gif "About and changelog")

### Clear encounter data or load sample data to perfect your setup.
![Clear encounter and load sample data](https://i.imgur.com/hfvn80v.gif "Clear encounter and load sample data")
![Load sample spell data](https://i.imgur.com/FTVyfGt.gif "Load sample spell data")

## Installation

#### Other Languages Available

   - [日本語：Onlinegaming.life](https://onlinegaming.life/ff14/ember-overlay/)

To use this overlay, you need Advanced Combat Tracker (ACT) and OverlayPlugin. Please follow the guide based on your situation:

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
- [**okuRaku**](https://github.com/okuRaku) - Japanese
- **Astriel** - German
- **Claud** - Spanish
- **Okâme** - French
- **Tsunari96** - Tsunari96#8491 (Discord) - Korean
- [**justscribe**](https://github.com/justscribe) - [Twitch](https://www.twitch.tv/justscribe), [Website](https://ffxiv.gaming4eternity.online/) - Ukrainian
- **Gisar** - Russian

### Featured Donors

- Pimpy Shortstocking
- FortiusTTV - [Twitch](https://www.twitch.tv/fortiusttv)

### Donors

- Amneamnius
- Vulasuw
- Jessica
- mehdont

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

0. For new features, it would be best to first discuss your plans in an issue. This is to ensure that I haven't already completed a similar feature locally, that I agree with your approach, and that your feature aligns with the overall vision of the project. Bypassing this and sending new features straight to pull may result in pull rejection.
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
Copyright (C) 2019-2021, Patrick Golden. All rights reserved.

Copyrights licensed under GNU General Public License v3.0 only.

See the accompanying [LICENSE](/LICENSE) file for terms.
