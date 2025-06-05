import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.animation import FuncAnimation
import numpy as np
import threading
import time
from collections import deque
import requests
import json
from datetime import datetime

# For GPS/location services (you'll need to install these)
try:
    import gpsd
    GPS_AVAILABLE = True
except ImportError:
    GPS_AVAILABLE = False
    print("GPS module not available. Install python-gps for GPS functionality.")

class SpeedMonitorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Vertical Speed Monitor")
        self.root.geometry("800x600")
        self.root.configure(bg='#1e1e1e')
        
        # Data storage
        self.speed_history = deque(maxlen=100)
        self.time_history = deque(maxlen=100)
        self.current_speed = 0.0
        self.max_speed = 0.0
        self.current_location = None
        self.speed_limit = None
        
        # Monitoring flags
        self.is_monitoring = False
        self.gps_connected = False
        self.gps_retry_count = 0
        self.max_gps_retries = 10
        
        self.setup_ui()
        self.setup_plot()
        self.connect_gps()
        
    def setup_ui(self):
        # Main container
        main_frame = tk.Frame(self.root, bg='#1e1e1e')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Digital display frame
        digital_frame = tk.Frame(main_frame, bg='#2d2d2d', relief=tk.RAISED, bd=2)
        digital_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Current speed display
        self.speed_label = tk.Label(
            digital_frame,
            text="0.0",
            font=('Digital-7', 52, 'bold'),
            fg='#00ff00',
            bg='#2d2d2d'
        )
        self.speed_label.pack(pady=10)
        
        tk.Label(
            digital_frame,
            text="km/h",
            font=('Arial', 16),
            fg='#ffffff',
            bg='#2d2d2d'
        ).pack()
        
        # Stats frame
        stats_frame = tk.Frame(digital_frame, bg='#2d2d2d')
        stats_frame.pack(fill=tk.X, padx=20, pady=10)
        
        # Max speed
        tk.Label(
            stats_frame,
            text="Max Speed:",
            font=('Arial', 12, 'bold'),
            fg='#ffffff',
            bg='#2d2d2d'
        ).grid(row=0, column=0, sticky='w')
        
        self.max_speed_label = tk.Label(
            stats_frame,
            text="0.0 km/h",
            font=('Arial', 18, 'bold'),
            fg='#ffff00',
            bg='#2d2d2d'
        )
        self.max_speed_label.grid(row=0, column=1, sticky='e')
        
        # Speed limit
        tk.Label(
            stats_frame,
            text="Speed Limit:",
            font=('Arial', 12, 'bold'),
            fg='#ffffff',
            bg='#2d2d2d'
        ).grid(row=1, column=0, sticky='w')
        
        self.speed_limit_label = tk.Label(
            stats_frame,
            text="-- km/h",
            font=('Arial', 18, 'bold'),
            fg='#ff6600',
            bg='#2d2d2d'
        )
        self.speed_limit_label.grid(row=1, column=1, sticky='e')
        
        stats_frame.columnconfigure(1, weight=1)
        
        # Control buttons
        control_frame = tk.Frame(main_frame, bg='#1e1e1e')
        control_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.start_button = tk.Button(
            control_frame,
            text="Start Monitoring",
            command=self.toggle_monitoring,
            bg="#1F8823",
            fg="#dbd5d5",
            font=('Arial', 12, 'bold'),
            padx=20
        )
        self.start_button.pack(side=tk.LEFT, padx=(0, 10))
        
        self.reset_button = tk.Button(
            control_frame,
            text="Reset",
            command=self.reset_data,
            bg="#f7291a",
            fg="#dbd5d5",
            font=('Arial', 12, 'bold'),
            padx=20
        )
        self.reset_button.pack(side=tk.LEFT)
        
        # GPS status
        self.gps_status_label = tk.Label(
            control_frame,
            text="GPS: Disconnected",
            font=('Arial', 12),
            fg='#ff0000',
            bg='#1e1e1e'
        )
        self.gps_status_label.pack(side=tk.RIGHT)
        
        # Graph frame
        self.graph_frame = tk.Frame(main_frame, bg='#2d2d2d', relief=tk.RAISED, bd=2)
        self.graph_frame.pack(fill=tk.BOTH, expand=True)
        
    def setup_plot(self):
        # Create matplotlib figure
        self.fig, self.ax = plt.subplots(figsize=(10, 4), facecolor='#2d2d2d')
        self.ax.set_facecolor('#1e1e1e')
        self.ax.set_xlabel('Time (s)', color='white', fontsize=12, fontweight='bold')
        self.ax.set_ylabel('Speed (km/h)', color='white', fontsize=12, fontweight='bold')
        self.ax.set_title('Speed History', color='white', fontsize=14, fontweight='bold')
        self.ax.tick_params(colors='white')
        self.ax.grid(True, alpha=0.3)
        
        # Initialize empty line
        self.line, = self.ax.plot([], [], color="#def50e", linewidth=2)
        self.speed_limit_line = None
        
        # Embed plot in tkinter
        self.canvas = FigureCanvasTkAgg(self.fig, self.graph_frame)
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        # Animation
        self.animation = FuncAnimation(
            self.fig, self.update_plot, interval=100, blit=False
        )
        
    def connect_gps(self):
        """Connect to GPS daemon with retry logic"""
        if not GPS_AVAILABLE:
            self.update_gps_status("GPS: Module not available")
            return
            
        def gps_thread():
            self.gps_retry_count = 0
            
            while self.gps_retry_count < self.max_gps_retries:
                try:
                    self.update_gps_status(f"GPS: Connecting... (Attempt {self.gps_retry_count + 1}/{self.max_gps_retries})")
                    
                    gpsd.connect()
                    self.gps_connected = True
                    self.update_gps_status("GPS: Connected")
                    
                    # Main GPS data loop
                    while self.gps_connected:
                        try:
                            packet = gpsd.get_current()
                            if packet.mode >= 2:  # 2D fix or better
                                # Convert m/s to km/h
                                speed_ms = getattr(packet, 'speed', 0)
                                if speed_ms is not None:
                                    self.current_speed = speed_ms * 3.6
                                    self.current_location = (packet.lat, packet.lon)
                                    self.get_speed_limit()
                            time.sleep(0.1)
                        except Exception as e:
                            print(f"GPS data error: {e}")
                            # If we lose connection during operation, try to reconnect
                            self.gps_connected = False
                            break
                    
                    # If we exit the main loop, try to reconnect
                    if self.gps_retry_count < self.max_gps_retries - 1:
                        self.gps_retry_count += 1
                        time.sleep(2)  # Wait 2 seconds before retry
                        continue
                    else:
                        break
                        
                except Exception as e:
                    self.gps_retry_count += 1
                    print(f"GPS connection attempt {self.gps_retry_count} failed: {e}")
                    
                    if self.gps_retry_count < self.max_gps_retries:
                        self.update_gps_status(f"GPS: Retry in 2s... ({self.gps_retry_count}/{self.max_gps_retries})")
                        time.sleep(2)  # Wait 2 seconds before retry
                    else:
                        break
            
            # All retry attempts failed
            error_message = "GPS is not available. As I want this to use as a car speed monitor, it should be correct."
            print(error_message)
            self.update_gps_status("GPS: Failed - Not Available")
                
        threading.Thread(target=gps_thread, daemon=True).start()
        
    def get_speed_limit(self):
        """Get speed limit for current location using OpenStreetMap Overpass API"""
        if not self.current_location:
            return
            
        def speed_limit_thread():
            try:
                lat, lon = self.current_location
                # Overpass API query for speed limits
                overpass_url = "http://overpass-api.de/api/interpreter"
                overpass_query = f"""
                [out:json];
                (
                  way(around:100,{lat},{lon})["maxspeed"];
                );
                out tags;
                """
                
                response = requests.post(overpass_url, data=overpass_query, timeout=5)
                data = response.json()
                
                if data['elements']:
                    maxspeed = data['elements'][0]['tags'].get('maxspeed')
                    if maxspeed and maxspeed.isdigit():
                        self.speed_limit = int(maxspeed)
                        self.root.after(0, self.update_speed_limit_display)
                        
            except Exception as e:
                print(f"Error getting speed limit: {e}")
                
        threading.Thread(target=speed_limit_thread, daemon=True).start()
        
    def update_speed_limit_display(self):
        """Update speed limit display"""
        if self.speed_limit:
            self.speed_limit_label.config(text=f"{self.speed_limit} km/h")
            
    def update_gps_status(self, status):
        """Update GPS status label"""
        if 'Connected' in status:
            color = '#00ff00'
        elif 'Connecting' in status or 'Retry' in status:
            color = '#ffff00'
        else:
            color = '#ff0000'
        self.root.after(0, lambda: self.gps_status_label.config(text=status, fg=color))
        
    def toggle_monitoring(self):
        """Toggle speed monitoring"""
        if not self.gps_connected:
            self.update_gps_status("GPS: Must be connected to monitor speed")
            return
            
        self.is_monitoring = not self.is_monitoring
        
        if self.is_monitoring:
            self.start_button.config(text="Stop Monitoring", bg='#f44336')
        else:
            self.start_button.config(text="Start Monitoring", bg='#4CAF50')
            
    def reset_data(self):
        """Reset all data"""
        self.speed_history.clear()
        self.time_history.clear()
        self.max_speed = 0.0
        self.current_speed = 0.0
        self.max_speed_label.config(text="0.0 km/h")
        
    def update_plot(self, frame):
        """Update the speed plot"""
        if self.is_monitoring and self.gps_connected:
            current_time = time.time()
            self.speed_history.append(self.current_speed)
            self.time_history.append(current_time)
            
            # Update max speed
            if self.current_speed > self.max_speed:
                self.max_speed = self.current_speed
                self.max_speed_label.config(text=f"{self.max_speed:.1f} km/h")
            
            # Update digital display
            color = '#ff0000' if (self.speed_limit and self.current_speed > self.speed_limit) else '#00ff00'
            self.speed_label.config(text=f"{self.current_speed:.1f}", fg=color)
            
        if len(self.time_history) > 1:
            # Convert to relative time
            times = np.array(self.time_history)
            relative_times = times - times[0]
            speeds = np.array(self.speed_history)
            
            # Update plot
            self.line.set_data(relative_times, speeds)
            
            # Update plot limits
            self.ax.set_xlim(max(0, relative_times[-1] - 60), relative_times[-1] + 1)
            self.ax.set_ylim(0, max(100, max(speeds) * 1.1) if len(speeds) > 0 else 100)
            
            # Add speed limit line
            if self.speed_limit:
                if self.speed_limit_line:
                    self.speed_limit_line.remove()
                self.speed_limit_line = self.ax.axhline(
                    y=self.speed_limit, 
                    color='red', 
                    linestyle='--', 
                    alpha=0.7,
                    label=f'Speed Limit: {self.speed_limit} km/h'
                )
                
        return self.line,

def main():
    root = tk.Tk()
    app = SpeedMonitorApp(root)
    
    try:
        root.mainloop()
    except KeyboardInterrupt:
        print("Application closed by user")

if __name__ == "__main__":
    main()
