# ACT + OverlayPlugin Installation

## Navigation
- <a href="#installing-act">Installing ACT</a>
- <a href="#configuring-windows-permissions">Configuring Windows Permissions</a>
    - <a href="#run-as-administrator">Run as Administrator</a>
    - <a href="#add-firewall-exception">Add Firewall Exception</a>
- <a href="#installing-overlayplugin">Installing OverlayPlugin</a>
- <a href="#using-the-web-socket">Using the Web Socket</a>

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

1. Open the Windows file browser, right-click the address bar, choose "Edit Address," and enter `%APPDATA%\Advanced Combat Tracker` -- then hit enter.

![](https://i.imgur.com/8j1slAT.png)

![](https://i.imgur.com/6hWQMPX.png)

2. You should now be in the folder `<your name>\AppData\Roaming\Advanced Combat Tracker`. We'll come back to this folder in a moment.

3. [Download OverlayPlugin](https://github.com/GoldenChrysus/ffxiv-ember-overlay/raw/bleeding-edge/act/OverlayPlugin.zip) from the Ember GitHub repository.

4. Move (or copy) the file downloaded from step 3 into the folder you opened in step 1. You should now have a file called `OverlayPlugin.zip` in the folder from step 1.

![](https://i.imgur.com/n9mcZW7.png)

5. Right-click `OverlayPlugin.zip` and choose "Extract All..."

![](https://i.imgur.com/9kgy1Zs.png)

6. In the window that opens, remove the text "OverlayPlugin" from the end of the destination path as in the following images:

![](https://i.imgur.com/J9C2onU.png)
![](https://i.imgur.com/MwwaKnQ.png)

7. Click "Extract" at the bottom of the window.

8. Open ACT. If you receive a notice about blocked files, choose "Yes."

9. Go to Plugins > Plugin Listing and choose "Browse."

![](https://i.imgur.com/VM7S8mf.png)

10. In the window that appears, right-click the address bar to edit the address as you did in step 1, but enter `%APPDATA%\Advanced Combat Tracker\Plugins\OverlayPlugin` -- then choose the `OverlayPlugin.dll` file and click "Open."

![](https://i.imgur.com/qnpqTiq.png)

11. The plugin should now be listed in the file path box. Click "Add/Enable Plugin" to finish adding the plugin. If you receive a notice about blocked files, choose "Yes."

![](https://i.imgur.com/D7AWg23.png)

12. Your plugin list should list `OverlayPlugin.dll` below `FFXIV_ACT_Plugin.dll`. If it does not, use the up/down arrows to rearrange them accordingly. Rearranging the plugins will require a restart of ACT.

![](https://i.imgur.com/B6EnhwP.png)

13. Ember Overlay should be visible at this point. Navigate to Plugins > OverlayPlugin.dll > Ember Overlay and ensure the settings panel has the appropriate settings.

![](https://i.imgur.com/1L4cVwo.png)

14. If there is no overlay, simply click the "New" button, choose the "Ember" preset, and click "OK."

![](https://i.imgur.com/OQa349P.png)

## Using the Web Socket

This section is only for people who wish to use the Web socket with an overlay. This allows you to view the overlay in other ways, such as adding it as an OBS browser source, opening it on your phone, etc. If you don't need to do this, skip this section.

1. In ACT, navigate to Plugins > OverlayPlugin WSServer. Ensure the IP address is set to `127.0.0.1` and the port is set to `10501`. Then click "Start."

Note: If you know you want to use a different IP address or port, change them accordingly. IPv6 users may want to use `[::1]` or you may want to bind the socket to all available IP's by using `0.0.0.0`

![](https://i.imgur.com/9RKV5U8.png)

2. Select your desired Web socket overlay from the "Overlay" dropdown. The URL provided in the text box is the URL you should use in OBS, on your phone, etc. This URL is different from the one that appears in your OverlayPlugin.dll tab.

![](https://i.imgur.com/s79ArxT.png)

3. Navigate to Plugins > OverlayPlugin.dll > Ember Overlay > ACTWS, and check the "This is an overlay that requires ACTWebSocket" option.

![](https://i.imgur.com/8Tsvxux.png)
