from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.clock import Clock
from kivy.utils import platform
from kivy.uix.popup import Popup
import time
from collections import deque

# Mobile GPS and permissions
if platform == 'android':
    from android.permissions import request_permissions, Permission
    from plyer import gps
    from jnius import autoclass
    PythonActivity = autoclass('org.kivy.android.PythonActivity')
    IS_ANDROID = True
else:
    IS_ANDROID = False

class SpeedMonitorApp(App):
    def __init__(self):
        super().__init__()
        self.current_speed = 0.0
        self.max_speed = 0.0
        self.speed_history = deque(maxlen=100)
        self.is_monitoring = False
        self.gps_started = False
        self.permissions_granted = False
        
    def build(self):
        self.title = "Car Speed Monitor"
        
        # Main layout
        main_layout = BoxLayout(orientation='vertical', padding=20, spacing=10)
        
        # Title
        title = Label(
            text='Car Speed Monitor',
            size_hint_y=0.1,
            font_size='24sp',
            bold=True
        )
        main_layout.add_widget(title)
        
        # Current speed display
        self.speed_label = Label(
            text='0.0',
            size_hint_y=0.3,
            font_size='72sp',
            bold=True,
            color=(0, 1, 0, 1)  # Green
        )
        main_layout.add_widget(self.speed_label)
        
        # Speed unit
        unit_label = Label(
            text='km/h',
            size_hint_y=0.1,
            font_size='18sp'
        )
        main_layout.add_widget(unit_label)
        
        # Max speed
        self.max_speed_label = Label(
            text='Max Speed: 0.0 km/h',
            size_hint_y=0.1,
            font_size='16sp',
            color=(1, 1, 0, 1)  # Yellow
        )
        main_layout.add_widget(self.max_speed_label)
        
        # GPS status
        self.gps_status_label = Label(
            text='GPS: Initializing...',
            size_hint_y=0.1,
            font_size='14sp',
            color=(1, 1, 0, 1)  # Yellow
        )
        main_layout.add_widget(self.gps_status_label)
        
        # Control buttons
        button_layout = BoxLayout(orientation='horizontal', size_hint_y=0.15, spacing=10)
        
        self.start_button = Button(
            text='Request GPS Permission',
            background_color=(0.12, 0.53, 0.14, 1)  # Green
        )
        self.start_button.bind(on_press=self.on_start_button_press)
        button_layout.add_widget(self.start_button)
        
        reset_button = Button(
            text='Reset',
            background_color=(0.97, 0.16, 0.10, 1)  # Red
        )
        reset_button.bind(on_press=self.reset_data)
        button_layout.add_widget(reset_button)
        
        main_layout.add_widget(button_layout)
        
        # Initialize GPS
        if IS_ANDROID:
            self.request_permissions()
        else:
            self.gps_status_label.text = "GPS: Desktop mode (no GPS)"
            self.start_button.text = "Start Simulation"
        
        return main_layout
    
    def request_permissions(self):
        """Request location permissions on Android"""
        def callback(permissions, results):
            if all(results):
                self.permissions_granted = True
                self.gps_status_label.text = "GPS: Permissions granted"
                self.start_button.text = "Start Monitoring"
                print("Location permissions granted")
            else:
                self.permissions_granted = False
                self.gps_status_label.text = "GPS: Permissions denied"
                self.show_permission_error()
                print("Location permissions denied")
        
        try:
            permissions = [
                Permission.ACCESS_FINE_LOCATION,
                Permission.ACCESS_COARSE_LOCATION
            ]
            self.gps_status_label.text = "GPS: Requesting permissions..."
            request_permissions(permissions, callback)
        except Exception as e:
            print(f"Permission request error: {e}")
            self.show_permission_error()
    
    def show_permission_error(self):
        """Show error popup when permissions are denied"""
        content = BoxLayout(orientation='vertical', spacing=10, padding=10)
        
        error_label = Label(
            text='Location Permission Required\n\nThis app needs GPS access to monitor\nyour car speed accurately.\n\nPlease grant location permissions\nand restart the app.',
            text_size=(300, None),
            halign='center',
            valign='middle'
        )
        content.add_widget(error_label)
        
        button_layout = BoxLayout(orientation='horizontal', size_hint_y=0.3, spacing=10)
        
        retry_button = Button(text='Retry')
        exit_button = Button(text='Exit')
        
        button_layout.add_widget(retry_button)
        button_layout.add_widget(exit_button)
        content.add_widget(button_layout)
        
        popup = Popup(
            title='Permission Required',
            content=content,
            size_hint=(0.8, 0.6),
            auto_dismiss=False
        )
        
        retry_button.bind(on_press=lambda x: [popup.dismiss(), self.request_permissions()])
        exit_button.bind(on_press=lambda x: self.stop())
        
        popup.open()
    
    def on_start_button_press(self, instance):
        """Handle start button press"""
        if not IS_ANDROID:
            # Desktop simulation mode
            self.toggle_simulation()
            return
        
        if not self.permissions_granted:
            self.request_permissions()
            return
        
        if not self.gps_started:
            self.start_gps()
        else:
            self.toggle_monitoring()
    
    def start_gps(self):
        """Start GPS tracking"""
        try:
            gps.configure(
                on_location=self.on_location,
                on_status=self.on_status
            )
            gps.start(minTime=1000, minDistance=0)  # Update every 1 second
            self.gps_started = True
            self.gps_status_label.text = "GPS: Starting..."
            self.start_button.text = "Start Monitoring"
            print("GPS started successfully")
        except Exception as e:
            print(f"GPS start error: {e}")
            self.gps_status_label.text = f"GPS: Error - {str(e)}"
            self.show_gps_error()
    
    def on_location(self, **kwargs):
        """GPS location callback"""
        try:
            lat = kwargs.get('lat', 0)
            lon = kwargs.get('lon', 0)
            speed = kwargs.get('speed', 0)  # Usually in m/s
            
            # Convert speed from m/s to km/h
            if speed is not None and speed >= 0:
                self.current_speed = speed * 3.6
            else:
                self.current_speed = 0.0
            
            if not self.is_monitoring:
                self.gps_status_label.text = "GPS: Ready"
                self.gps_status_label.color = (0, 1, 0, 1)  # Green
            
            print(f"Location: {lat}, {lon}, Speed: {self.current_speed:.1f} km/h")
            
        except Exception as e:
            print(f"Location processing error: {e}")
    
    def on_status(self, stype, status):
        """GPS status callback"""
        print(f"GPS Status: {stype} - {status}")
        if stype == 'provider-enabled':
            self.gps_status_label.text = "GPS: Enabled"
        elif stype == 'provider-disabled':
            self.gps_status_label.text = "GPS: Disabled"
            self.gps_status_label.color = (1, 0, 0, 1)  # Red
    
    def show_gps_error(self):
        """Show GPS error popup"""
        content = Label(
            text='GPS Error\n\nCannot start GPS tracking.\nPlease check if location services\nare enabled in your device settings.',
            text_size=(300, None),
            halign='center',
            valign='middle'
        )
        
        popup = Popup(
            title='GPS Error',
            content=content,
            size_hint=(0.8, 0.4)
        )
        popup.open()
    
    def toggle_monitoring(self):
        """Toggle speed monitoring"""
        if not self.permissions_granted and IS_ANDROID:
            self.request_permissions()
            return
        
        self.is_monitoring = not self.is_monitoring
        
        if self.is_monitoring:
            self.start_button.text = "Stop Monitoring"
            self.start_button.background_color = (0.97, 0.16, 0.10, 1)  # Red
            Clock.schedule_interval(self.update_display, 0.1)  # Update every 0.1 seconds
        else:
            self.start_button.text = "Start Monitoring"
            self.start_button.background_color = (0.12, 0.53, 0.14, 1)  # Green
            Clock.unschedule(self.update_display)
    
    def toggle_simulation(self):
        """Toggle simulation mode for desktop testing"""
        import random
        
        self.is_monitoring = not self.is_monitoring
        
        if self.is_monitoring:
            self.start_button.text = "Stop Simulation"
            self.start_button.background_color = (0.97, 0.16, 0.10, 1)  # Red
            
            def simulate_speed(dt):
                # Simulate realistic speed changes
                change = random.uniform(-2, 2)
                self.current_speed = max(0, min(130, self.current_speed + change))
            
            Clock.schedule_interval(simulate_speed, 0.5)
            Clock.schedule_interval(self.update_display, 0.1)
        else:
            self.start_button.text = "Start Simulation"
            self.start_button.background_color = (0.12, 0.53, 0.14, 1)  # Green
            Clock.unschedule(self.update_display)
    
    def update_display(self, dt):
        """Update speed display"""
        if self.is_monitoring:
            # Update current speed display
            self.speed_label.text = f"{self.current_speed:.1f}"
            
            # Update max speed
            if self.current_speed > self.max_speed:
                self.max_speed = self.current_speed
                self.max_speed_label.text = f"Max Speed: {self.max_speed:.1f} km/h"
            
            # Store speed history
            self.speed_history.append(self.current_speed)
            
            # Change color based on speed (red if over 100 km/h)
            if self.current_speed > 100:
                self.speed_label.color = (1, 0, 0, 1)  # Red
            else:
                self.speed_label.color = (0, 1, 0, 1)  # Green
    
    def reset_data(self, instance):
        """Reset all speed data"""
        self.current_speed = 0.0
        self.max_speed = 0.0
        self.speed_history.clear()
        self.speed_label.text = "0.0"
        self.max_speed_label.text = "Max Speed: 0.0 km/h"
        self.speed_label.color = (0, 1, 0, 1)  # Green
    
    def on_pause(self):
        """Handle app pause"""
        return True
    
    def on_resume(self):
        """Handle app resume"""
        pass

if __name__ == '__main__':
    SpeedMonitorApp().run()
