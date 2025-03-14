[app]
title = HUD Mirror
package.name = hudmirror
package.domain = com.felisha76
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 0.1
requirements = python3,kivy,numpy,android
orientation = landscape
fullscreen = 1
android.permissions = FOREGROUND_SERVICE, SYSTEM_ALERT_WINDOW, INTERNET, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE
android.api = 31
android.minapi = 21
android.ndk = 25b
android.sdk = 30
android.arch = arm64-v8a

[buildozer]
log_level = 2
