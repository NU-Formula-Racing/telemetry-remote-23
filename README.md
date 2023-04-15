# Telemetry Remote NFR23

## Getting Started

execute the `initApp.bat` file from file explorer. Close the command prompt windows after completion.

## Usage

execute the `runApp.bat` file from file explorer. If you need to restart the app, remember to run `killApp.bat` before running the `runApp.bat` file again.
<br>
The instructions below can also be found in the settings page of the app. (Click top right gear icon)

### Controls
- w/s: Zoom in/out on graphs
- a/d: pan left/right on graphs
- shift + W/A/S/D: zoom/pan 10x faster
- shift + R: resume live scrolling

### Connecting to live data
1. Click connect to server.
2. Navigate to sessions page. Select session or create one
3. Data is live. Pan/zoom enabled

### F*ck. Things are broken
Try the below fixes in order. <br>
Need to reslect the same session after. <br>
(unless you restart the whole app)

1. Switch tabs on the side nav.
2. Disconnect and reconnect to server.
3. Refresh the tab.
4. Relaunch the app entirely. (run `killApp.bat` and then `runApp.bat`)
5. Ping on slack.

![Alt text](./screenshot.png "Screenshot")