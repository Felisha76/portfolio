from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.switch import Switch
from kivy.uix.slider import Slider
from kivy.clock import Clock
from kivy.utils import platform
from kivy.garden.matplotlib.backend_kivyagg import FigureCanvasKivyAgg
import matplotlib.pyplot as plt
from collections import deque
import numpy as np
import threading
import time
import os
from datetime import datetime
import json

# Mobile-specific imports
if platform == 'android':
    from android.permissions import request_permissions, Permission
    from android import activity
    from jnius import autoclass, cast
    from android.runnable import run_on_ui_thread
    
    # Android classes
    PythonActivity = autoclass('org.kivy.android.PythonActivity')
    LocationManager = autoclass('android.location.LocationManager')
    Context = autoclass('android.content.Context')
    MediaRecorder = autoclass('android.media.MediaRecorder')
    Camera = autoclass('android.hardware.Camera')

class MobileSpeedApp(App):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Speed data
        self.speed_history = deque(maxlen=200)
        self.time_history = deque(maxlen=200)
        self.current_speed = 0.0
        self.max_speed = 0.0
        self.avg_speed = 0.0
        
        # Recording settings
        self.auto_record_enabled = False
        self.recording_threshold = 5.0  # km/h
        self.stop_delay = 15  # seconds
        self.is_recording = False
        self.below_threshold_time = 0
        self.last_speed_check = time.time()
        
        # Location/GPS
        self.location_manager = None
        self.gps_enabled = False
        
        # Camera/Recording
        self.media_recorder = None
        self.camera = None
        self.recording_file = None
        
        # App state
        self.is_monitoring = False
        
    def build(self):
        # Request permissions first
        if platform == 'android':
            self.request_android_permissions()
            
        # Main layout
        main_layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        # Digital speed display
        speed_layout = BoxLayout(orientation='vertical', size_hint_y=0.3)
        
        self.speed_label = Label(
            text='0.0',
            font_size='60sp',
            color=(0, 1, 0, 1),  # Green
            bold=True,
            size_hint_y=0.7
        )
        speed_layout.add_widget(self.speed_label)
        
        speed_unit_label = Label(
            text='km/h',
            font_size='20sp',
            color=(1, 1, 1, 1),
            size_hint_y=0.3
        )
        speed_layout.add_widget(speed_unit_label)
        
        main_layout.add_widget(speed_layout)
        
        # Stats layout
        stats_layout = GridLayout(cols=2, size_hint_y=0.15, spacing=5)
        
        stats_layout.add_widget(Label(text='Max Speed:', color=(1, 1, 1, 1)))
        self.max_speed_label = Label(text='0.0 km/h', color=(1, 1, 0, 1))
        stats_layout.add_widget(self.max_speed_label)
        
        stats_layout.add_widget(Label(text='Avg Speed:', color=(1, 1, 1, 1)))
        self.avg_speed_label = Label(text='0.0 km/h', color=(0, 1, 1, 1))
        stats_layout.add_widget(self.avg_speed_label)
        
        main_layout.add_widget(stats_layout)
        
        # Recording controls
        record_layout = BoxLayout(orientation='vertical', size_hint_y=0.2, spacing=5)
        
        # Auto-record toggle
        auto_record_layout = BoxLayout(orientation='horizontal', size_hint_y=0.5)
        auto_record_layout.add_widget(Label(text='Auto Dashcam:', color=(1, 1, 1, 1)))
        
        self.auto_record_switch = Switch(active=False)
        self.auto_record_switch.bind(active=self.toggle_auto_record)
        auto_record_layout.add_widget(self.auto_record_switch)
        
        record_layout.add_widget(auto_record_layout)
        
        # Recording status
        self.record_status_label = Label(
            text='Recording: OFF',
            color=(1, 0, 0, 1),
            size_hint_y=0.5
        )
        record_layout.add_widget(self.record_status_label)
        
        main_layout.add_widget(record_layout)
        
        # Control buttons
        button_layout = BoxLayout(orientation='horizontal', size_hint_y=0.1, spacing=10)
        
        self.start_button = Button(
            text='Start Monitoring',
            background_color=(0, 0.8, 0, 1)
        )
        self.start_button.bind(on_press=self.toggle_monitoring)
        button_layout.add_widget(self.start_button)
        
        reset_button = Button(
            text='Reset',
            background_color=(0.8, 0, 0, 1)
        )
        reset_button.bind(on_press=self.reset_data)
        button_layout.add_widget(reset_button)
        
        main_layout.add_widget(button_layout)
        
        # Speed graph
        self.setup_graph()
        main_layout.add_widget(self.graph_widget)
        
        # Start update clock
        Clock.schedule_interval(self.update_display, 0.1)
        
        return main_layout
    
    def request_android_permissions(self):
        """Request necessary Android permissions"""
        permissions = [
            Permission.ACCESS_FINE_LOCATION,
            Permission.ACCESS_COARSE_LOCATION,
            Permission.CAMERA,
            Permission.RECORD_AUDIO,
            Permission.WRITE_EXTERNAL_STORAGE,
            Permission.READ_EXTERNAL_STORAGE
        ]
        request_permissions(permissions)
        
    def setup_graph(self):
        """Setup matplotlib graph for speed history"""
        plt.style.use('dark_background')
        self.fig, self.ax = plt.subplots(figsize=(8, 3))
        self.ax.set_facecolor('#1e1e1e')
        self.ax.set_xlabel('Time (s)', color='white')
        self.ax.set_ylabel('Speed (km/h)', color='white')
        self.ax.set_title('Speed History', color='white')
        self.ax.grid(True, alpha=0.3)
        
        self.line, = self.ax.plot([], [], color='#00ff00', linewidth=2)
        self.threshold_line = self.ax.axhline(
            y=self.recording_threshold, 
            color='red', 
            linestyle='--', 
            alpha=0.7,
            label=f'Record Threshold: {self.recording_threshold} km/h'
        )
        
        self.graph_widget = FigureCanvasKivyAgg(self.fig)
        
    def toggle_auto_record(self, instance, value):
        """Toggle automatic recording"""
        self.auto_record_enabled = value
        if value:
            self.setup_camera()
        else:
            self.cleanup_camera()
            
    def setup_camera(self):
        """Initialize camera for recording"""
        if platform != 'android':
            return
            
        try:
            # Initialize camera
            self.camera = Camera.open()
            
            # Setup media recorder
            self.media_recorder = MediaRecorder()
            self.media_recorder.setCamera(self.camera)
            self.media_recorder.setAudioSource(MediaRecorder.AudioSource.CAMCORDER)
            self.media_recorder.setVideoSource(MediaRecorder.VideoSource.CAMERA)
            self.media_recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            self.media_recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            self.media_recorder.setVideoEncoder(MediaRecorder.VideoEncoder.H264)
            self.media_recorder.setVideoSize(1920, 1080)
            self.media_recorder.setVideoFrameRate(30)
            
        except Exception as e:
            print(f"Camera setup error: {e}")
            
    def cleanup_camera(self):
        """Clean up camera resources"""
        if self.is_recording:
            self.stop_recording()
            
        if self.media_recorder:
            try:
                self.media_recorder.release()
            except:
                pass
            self.media_recorder = None
            
        if self.camera:
            try:
                self.camera.release()
            except:
                pass
            self.camera = None
            
    def start_recording(self):
        """Start video recording"""
        if not self.auto_record_enabled or self.is_recording:
            return
            
        try:
            # Create filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"dashcam_{timestamp}.mp4"
            
            if platform == 'android':
                # Android external storage path
                from android.storage import primary_external_storage_path
                storage_path = primary_external_storage_path()
                self.recording_file = os.path.join(storage_path, "DashCam", filename)
                
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(self.recording_file), exist_ok=True)
            else:
                # Desktop path
                self.recording_file = os.path.join("recordings", filename)
                os.makedirs("recordings", exist_ok=True)
            
            if self.media_recorder and platform == 'android':
                self.media_recorder.setOutputFile(self.recording_file)
                self.media_recorder.prepare()
                self.media_recorder.start()
                
            self.is_recording = True
            self.record_status_label.text = 'Recording: ON'
            self.record_status_label.color = (0, 1, 0, 1)  # Green
            
            print(f"Started recording: {self.recording_file}")
            
        except Exception as e:
            print(f"Recording start error: {e}")
            
    def stop_recording(self):
        """Stop video recording"""
        if not self.is_recording:
            return
            
        try:
            if self.media_recorder and platform == 'android':
                self.media_recorder.stop()
                
            self.is_recording = False
            self.record_status_label.text = 'Recording: OFF'
            self.record_status_label.color = (1, 0, 0, 1)  # Red
            
            print(f"Stopped recording: {self.recording_file}")
            
            # Save recording info
            self.save_recording_info()
            
        except Exception as e:
            print(f"Recording stop error: {e}")
            
    def save_recording_info(self):
        """Save recording metadata"""
        if not self.recording_file:
            return
            
        info = {
            'filename': os.path.basename(self.recording_file),
            'timestamp': datetime.now().isoformat(),
            'max_speed': self.max_speed,
            'avg_speed': self.avg_speed,
            'duration': time.time() - self.last_speed_check
        }
        
        info_file = self.recording_file.replace('.mp4', '_info.json')
        try:
            with open(info_file, 'w') as f:
                json.dump(info, f, indent=2)
        except Exception as e:
            print(f"Error saving recording info: {e}")
            
    def toggle_monitoring(self, instance):
        """Toggle speed monitoring"""
        self.is_monitoring = not self.is_monitoring
        
        if self.is_monitoring:
            self.start_button.text = 'Stop Monitoring'
            self.start_button.background_color = (0.8, 0, 0, 1)
            self.start_gps()
        else:
            self.start_button.text = 'Start Monitoring'
            self.start_button.background_color = (0, 0.8, 0, 1)
            self.stop_gps()
            
    def start_gps(self):
        """Start GPS location services"""
        if platform == 'android':
            self.start_android_gps()
        else:
            # Simulate GPS for testing
            self.simulate_gps()
            
    def start_android_gps(self):
        """Start Android GPS"""
        try:
            activity = PythonActivity.mActivity
            context = cast('android.content.Context', activity)
            self.location_manager = cast('android.location.LocationManager', 
                                       context.getSystemService(Context.LOCATION_SERVICE))
            
            # Start location updates in a separate thread
            threading.Thread(target=self.gps_thread, daemon=True).start()
            
        except Exception as e:
            print(f"GPS start error: {e}")
            self.simulate_gps()
            
    def gps_thread(self):
        """GPS monitoring thread"""
        while self.is_monitoring:
            try:
                # Get location (simplified - you'd need proper location listener)
                # For now, simulate realistic speed data
                self.simulate_speed_data()
                time.sleep(0.1)
            except Exception as e:
                print(f"GPS thread error: {e}")
                break
                
    def simulate_gps(self):
        """Simulate GPS data for testing"""
        threading.Thread(target=self.gps_thread, daemon=True).start()
        
    def simulate_speed_data(self):
        """Generate realistic speed data for testing"""
        if not self.is_monitoring:
            return

        current_time = time.time()

        if len(self.speed_history) == 0:
            self.current_speed = 0
        else:
            # Random walk with realistic constraints
            change = np.random.normal(0, 1.5)
            self.current_speed = max(0, min(120, self.current_speed + change))

        # Add some realistic patterns
        if np.random.random() < 0.01:  # Occasional stops
            self.current_speed = 0

        self.speed_history.append(self.current_speed)
        self.time_history.append(current_time - self.last_speed_check)

        # Calculate stats
        self.max_speed = max(self.speed_history)
        self.avg_speed = np.mean(self.speed_history)

        # Auto recording logic
        if self.auto_record_enabled:
            if self.current_speed >= self.recording_threshold:
                self.below_threshold_time = 0
                if not self.is_recording:
                    self.start_recording()
            else:
                self.below_threshold_time += 0.1
                if self.is_recording and self.below_threshold_time >= self.stop_delay:
                    self.stop_recording()

            
    def stop_gps(self):
        """Stop GPS monitoring"""
        self.gps_enabled = False
        
    def update_display(self, dt):
        """Update display elements"""
        if not self.is_monitoring:
            return