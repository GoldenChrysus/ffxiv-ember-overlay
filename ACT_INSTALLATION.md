# ACT + OverlayPlugin Installation

## Navigation
- <a href="#installing-act">Installing ACT</a>
- <a href="#configuring-windows-permissions">Configuring Windows Permissions</a>
    - <a href="#run-as-administrator">Run as Administrator</a>
    - <a href="#add-firewall-exception">Add Firewall Exception</a>
- <a href="#installing-overlayplugin">Installing OverlayPlugin</a>
- <a href="#using-the-web-socket">Using the Web Socket</a>
- <a href="#using-in-obs">Using in OBS</a>
    - <a href="#running-multiple-modes-in-obs">Running Multiple Modes in OBS</a>

## Installing ACT

1. [Download ACT](https://advancedcombattracker.com/includes/page-download.php?id=56) and run through its installer.
2. Open ACT and follow along through the startup wizard.
3. On the "Parsing Plugin" tab, choose the "FFXIV Parsing Plugin" from the dropdown. Click "Download/Enable Plugin." You should receive a message that the plugin was added and started.

![](https://i.imgur.com/WWkZtAU.png)
![](https://i.imgur.com/d23Kvrm.png)

4. On the "Log File" tab, select "Yes" when asked if ACT will be used for Final Fantasy XIV. The log file should automatically be loaded after doing so.

![](https://i.imgur.com/CqudbIj.png)
![](https://i.imgur.com/xHMVJqX.png)

5. You don't need to make any changes to the "Startup Settings" tab, so you can click "Close" at the bottom of the window.

## Configuring Windows Permissions

ACT should always be run as administrator and excepted from Windows Firewall to make sure it works properly. This is because ACT uses memory reading and packet inspection to collect accurate data, which Windows doesn't allow by default.

### Run as Administrator

1. Open your start menu and search for Advanced Combat Tracker. Right-click and choose "Open file location."

![](https://i.imgur.com/VgzfraN.png)

2. Right-click the Advanced Combat Tracker shortcut and choose "Properties."

![](https://i.imgur.com/pqkRIOZ.png)

3. In the window that appears, switch to the "Compatibility" tab, check "Run this program as an administrator," then click "Apply."

![](https://i.imgur.com/3M7gZPR.png)

### Add Firewall Exception

1. Open your start menu and search for "allow app," then choose the "Allow an app through Windows Firewall" setting.

![](https://i.imgur.com/KvqTbBh.png)

2. Click "Change settings" then click "Allow another app..."

![](https://i.imgur.com/dfRRB9j.png)

3. Click "Browse..." then search for your Advanced Combat Tracker folder in your program files, choose the "Advanced Combat Tracker.exe" (you may not see the ".exe" part on your PC), then click "Open."

![](https://i.imgur.com/jeGFmPt.png)

4. Click "Network types..." and ensure both "Private" and "Public" are selected, then click "OK" then click "Add."

![](https://i.imgur.com/znWn9hH.png)

5. In the firewall settings you opened in step 1, click "OK."

6. In ACT, click "Plugins" then "FFXIV Settings" then "Test Game Connection." You should receive a message stating the memory signatures were detected and network data is available. This step must be done while FFXIV is running.

![](https://i.imgur.com/GyW8GAh.png)

## Installing OverlayPlugin

OverlayPlugin allows ACT to show your DPS and other metrics in a visually-pleasing manner over your game (hence, overlay). You will need this in order to use overlays such as Ember Overlay (pctured below):

![](https://i.imgur.com/tye5cGJ.png)

1. In ACT, navigate to Plugins > Plugin Listing and choose "Get Plugins..."

![](https://i.imgur.com/hPj8ysg.png)

2. Choose the "[FFXIV+others] Overlay Plugin" option, then click "Download and Enable."

![](https://i.imgur.com/u5y6KTe.png)

3. Your plugin list should list `OverlayPlugin.dll` below `FFXIV_ACT_Plugin.dll`. If it does not, use the up/down arrows to rearrange them accordingly. Rearranging the plugins will require a restart of ACT.

![](https://i.imgur.com/B6EnhwP.png)

4. Navigate to Plugins > OverlayPlugin.dll, click the "New" button, choose the "Ember" preset, and click "OK."

![](https://i.imgur.com/OQa349P.png)

5. Ember Overlay should be visible at this point. Ensure the settings panel for the overlay has the appropriate settings.

![](https://i.imgur.com/1L4cVwo.png)

## Using the Web Socket

This section is only for people who wish to use the Web socket with an overlay. This allows you to view the overlay in other ways, such as adding it as an OBS browser source, opening it on your phone, etc. If you don't need to do this, skip this section.

1. In ACT, navigate to Plugins > OverlayPlugin WSServer. Ensure the IP address is set to `127.0.0.1` and the port is set to `10501`. Then click "Start."

Note: If you know you want to use a different IP address or port, change them accordingly. IPv6 users may want to use `[::1]` or you may want to bind the socket to all available IP's by using `0.0.0.0`

![](https://i.imgur.com/9RKV5U8.png)

2. Select your desired Web socket overlay from the "Overlay" dropdown. The URL provided in the text box is the URL you should use in OBS, on your phone, etc. This URL is different from the one that appears in your OverlayPlugin.dll tab.

![](https://i.imgur.com/s79ArxT.png)

## Using in OBS

If you are a streamer, you can display the overlay in OBS. The easiest way to do this is by using window capture to capture your overlay along with your game. However, if you're using game capture or if you want your OBS overlay to have different settings than your personal overlay, follow the instructions below.

1. Ensure you have completed the [Using the Web Socket](#using-the-web-socket) steps above.

2. Add an OBS Browser Source using the URL you copied from the Using the Web Socket section.

![](https://i.imgur.com/AZHouEn.png)

![](https://i.imgur.com/IuyOAoF.png)

3. If you wish to resize the source, modify the width/height values directly in the source properties (the window where you enter the URL) instead of resizing the source visually in your scene.

![](https://i.imgur.com/cJxfmNy.png)

4. You can interact with the overlay (to change tabs, etc.) by right-clicking the overlay in your OBS scene stage and choosing "Interact."

![](https://i.imgur.com/hpK4XtP.png)

5. To import settings into the overlay (if you have your tables, CSS, etc. customized):

    1. Export the settings from a non-OBS overlay (gear icon > Export > copy big block of text).

    ![](https://i.imgur.com/ZG2DHB2.png)

    2. Interact with the OBS overlay. Once interacting, right-click the overlay, and choose "Import."

    ![](https://i.imgur.com/OytsHEB.png)

    3. Paste the text you just copied and click the "Import" button.

    ![](https://i.imgur.com/8HjM5P9.png)

    4. Done! In this example, I imported an overlay with the zoom setting at 150% so that it appears more clearly in OBS.

    ![](https://i.imgur.com/NgiggHz.png)

### Running Multiple Modes in OBS

When normally used in OverlayPlugin, Ember automatically handles running multiple instances in different modes. For example, you could have one overlay in parser/stats mode and one overlay in spell timer mode. However, when using multiple instances of Ember in OBS, the overlays will not be able to remember which mode they are supposed to be in. Therefore, you will need to modify the URL of each overlay a bit. Follow these steps:

1. Get your existing OBS overlay url. It's usually something like: `https://goldenchrysus.github.io/ffxiv/ember-overlay/?HOST_PORT=ws://127.0.0.1/ws`

2. Your URL will either say `?HOST_PORT` or `?OVERLAY_WS` somewhere in the URL. You will be changing this part.

3. After the `?`, add the following: `mode=your_mode&`

4. The URL should now look something like: `https://goldenchrysus.github.io/ffxiv/ember-overlay/?mode=your_mode&HOST_PORT=ws://127.0.0.1/ws`

5. The available modes are `stats` (for the normal parsing overlay) and `spells` (for spell timers). Change `your_mode` to one of these options. For example, my final URL's for each mode would be:

    1. Parsing overlay: `https://goldenchrysus.github.io/ffxiv/ember-overlay/?mode=stats&HOST_PORT=ws://127.0.0.1/ws`

    2. Spell timers: `https://goldenchrysus.github.io/ffxiv/ember-overlay/?mode=spells&HOST_PORT=ws://127.0.0.1/ws`

6. Use your final URL's in OBS to ensure your instances always load the mode you want them to be in.