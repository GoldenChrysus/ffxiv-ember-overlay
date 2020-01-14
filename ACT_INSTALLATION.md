#### THIS GUIDE IN DEVELOPMENT. DO NOT USE AS AN OFFICIAL GUIDE UNTIL THIS MESSAGE IS GONE.

# ACT + OverlayPlugin Installation

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

![](https://i.imgur.com/oOGboYp.png)

## Installing OverlayPlugin

OverlayPlugin allows ACT to show your DPS and other metrics in a visually-pleasing manner over your game (hence, overlay). You will need these in order to use overlays such as Ember Overlay.

1. 