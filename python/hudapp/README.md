# HUD Mirror App

This Android application allows you to mirror-flip other applications on your phone to use them as a HUD (Heads-Up Display).

## Features

- Captures screen content in real-time
- Horizontally flips the screen for HUD usage
- Simple one-button interface to start/stop mirroring

## How to Use

1. Install the app on your Android device
2. Launch the app
3. Press "Start Screen Capture" and grant the necessary permissions
4. Switch to the app you want to mirror (without closing this app)
5. The app will display a horizontally flipped version of your screen
6. Return to this app and press "Stop Screen Capture" when done

## Building from Source

To build the APK:

```bash
cd python/hudapp
buildozer android debug
```

## Requirements

- Android 5.0 (API 21) or higher
- Permission to capture screen content

## Technical Details

This app uses:
- Kivy for the UI
- Android's MediaProjection API for screen capture
- NumPy for image processing
```

## Create an app icon

```bash
mkdir -p python/hudapp/data
```

You would need to add an icon file at `python/hudapp/data/icon.png` for your app.

## Build Instructions

To build the Android APK:

```bash
cd python/hudapp
pip install buildozer
buildozer android debug
