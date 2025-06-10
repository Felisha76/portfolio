[app]
title = Car Speed Monitor
package.name = carspeedmonitor
package.domain = com.felisha76.carspeedmonitor

source.dir = .
source.include_exts = py,png,jpg,kv,atlas

version = 1.0
requirements = python3==3.10, kivy, plyer, jnius, android-permissions, numpy, requests, gpsd-py3


# Android specific permissions
android.permissions = INTERNET, ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION

[buildozer]
log_level = 2

[android]
android.api = 31
android.minapi = 21
android.sdk = 30
android.ndk = 25b
android.gradle_dependencies = 
android.add_src = 
android.add_java_dir = 
android.add_res_dir = 
android.add_assets_dir =
