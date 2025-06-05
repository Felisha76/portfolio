[app]
title = Car Speed Monitor
package.name = carspeedmonitor
package.domain = com.felisha76.carspeedmonitor

source.dir = .
source.include_exts = py,png,jpg,kv,atlas

version = 1.0
requirements = python3,kivy,plyer,jnius

# Android specific permissions
android.permissions = ACCESS_FINE_LOCATION,ACCESS_COARSE_LOCATION,INTERNET

[buildozer]
log_level = 2

[android]
android.api = 30
android.minapi = 21
android.sdk = 30
android.ndk = 23b
android.gradle_dependencies = 
android.add_src = 
android.add_java_dir = 
android.add_res_dir = 
android.add_assets_dir =
