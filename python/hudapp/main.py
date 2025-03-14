from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.clock import Clock
from kivy.graphics.texture import Texture
import numpy as np

# For Android-specific functionality
from jnius import autoclass, cast
from android.runnable import run_on_ui_thread
from android import activity

class HUDMirrorApp(App):
    def build(self):
        self.layout = BoxLayout(orientation='vertical')
        
        # Button to toggle screen capture
        self.capture_button = Button(
            text='Start Screen Capture',
            size_hint=(1, 0.1)
        )
        self.capture_button.bind(on_press=self.toggle_screen_capture)
        
        # Status label
        self.status_label = Label(
            text='Ready',
            size_hint=(1, 0.05)
        )
        
        # Image widget to display the mirrored screen
        self.image = Image(size_hint=(1, 0.85))
        
        self.layout.add_widget(self.capture_button)
        self.layout.add_widget(self.status_label)
        self.layout.add_widget(self.image)
        
        # Initialize Android-specific variables
        self.projection_manager = None
        self.virtual_display = None
        self.media_projection = None
        self.image_reader = None
        self.is_capturing = False
        
        # Screen dimensions
        self.width = 0
        self.height = 0
        
        # Initialize texture
        self.texture = None
        
        return self.layout
    
    def toggle_screen_capture(self, instance):
        if self.is_capturing:
            self.stop_screen_capture()
        else:
            self.request_screen_capture()
    
    def request_screen_capture(self):
        try:
            # Android MediaProjection request
            if not self.projection_manager:
                # Get the MediaProjectionManager
                Context = autoclass('android.content.Context')
                PythonActivity = autoclass('org.kivy.android.PythonActivity')
                activity = PythonActivity.mActivity
                
                MediaProjectionManager = autoclass('android.media.projection.MediaProjectionManager')
                self.projection_manager = cast(
                    MediaProjectionManager, 
                    activity.getSystemService(Context.MEDIA_PROJECTION_SERVICE)
                )
                
                # Request permission
                intent = self.projection_manager.createScreenCaptureIntent()
                activity.startActivityForResult(intent, 123)
                
                # Set up the callback for when permission is granted
                activity.bind(on_activity_result=self.on_activity_result)
                self.status_label.text = "Waiting for permission..."
        except Exception as e:
            self.status_label.text = f"Error: {str(e)}"
    
    def on_activity_result(self, request_code, result_code, data):
        if request_code == 123 and result_code == -1:  # RESULT_OK is -1
            # Permission granted, start screen capture
            self.start_screen_capture(data)
            self.capture_button.text = 'Stop Screen Capture'
            self.is_capturing = True
        else:
            self.status_label.text = "Permission denied or cancelled"
    
    @run_on_ui_thread
    def start_screen_capture(self, intent):
        try:
            # Get screen metrics
            PythonActivity = autoclass('org.kivy.android.PythonActivity')
            activity = PythonActivity.mActivity
            metrics = activity.getResources().getDisplayMetrics()
            self.width = metrics.widthPixels
            self.height = metrics.heightPixels
            screen_density = metrics.densityDpi
            
            # Create media projection
            self.media_projection = self.projection_manager.getMediaProjection(-1, intent)
            
            # Set up ImageReader for capturing frames
            ImageReader = autoclass('android.media.ImageReader')
            ImageFormat = autoclass('android.graphics.ImageFormat')
            
            # Using YUV_420_888 format which is more widely supported
            self.image_reader = ImageReader.newInstance(
                self.width, self.height, ImageFormat.YUV_420_888, 2
            )
            
            # Create virtual display
            DisplayManager = autoclass('android.hardware.display.DisplayManager')
            
            self.virtual_display = self.media_projection.createVirtualDisplay(
                "ScreenCapture",
                self.width, self.height, screen_density,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                self.image_reader.getSurface(),
                None, None
            )
            
            # Initialize texture
            self.texture = Texture.create(size=(self.width, self.height), colorfmt='rgba')
            self.image.texture = self.texture
            
            # Start capturing frames
            Clock.schedule_interval(self.capture_frame, 1/30)  # 30 FPS
            self.status_label.text = "Capturing screen..."
        except Exception as e:
            self.status_label.text = f"Error starting capture: {str(e)}"
            self.stop_screen_capture()
    
    def capture_frame(self, *args):
        image = None
        try:
            image = self.image_reader.acquireLatestImage()
            if image:
                try:
                    planes = image.getPlanes()
                    buffer = planes[0].getBuffer()
                    pixel_stride = planes[0].getPixelStride()
                    row_stride = planes[0].getRowStride()
                    row_padding = row_stride - pixel_stride * self.width
                    
                    # Use frombuffer instead of fromstring
                    bitmap_array = np.frombuffer(buffer.tobytes(), dtype=np.uint8)
                    
                    # Reshape properly based on actual dimensions
                    if row_padding == 0:
                        bitmap_array = bitmap_array.reshape((self.height, self.width, 4))
                    else:
                        # Handle row padding if present
                        bitmap_array = bitmap_array.reshape((self.height, -1))[:, :(self.width * 4)]
                    
                    # Flip horizontally to create mirror effect
                    bitmap_array = np.fliplr(bitmap_array)
                    
                    # Update texture
                    self.texture.blit_buffer(bitmap_array.tobytes(), colorfmt='rgba', bufferfmt='ubyte')
                    self.image.texture = self.texture
                except Exception as e:
                    self.status_label.text = f"Frame processing error: {str(e)}"
                finally:
                    if image:
                        image.close()
        except Exception as e:
            self.status_label.text = f"Frame capture error: {str(e)}"
            if image:
                try:
                    image.close()
                except:
                    pass
    
    def stop_screen_capture(self, *args):
        # Stop capturing frames
        Clock.unschedule(self.capture_frame)
        
        # Release resources
        if self.virtual_display:
            self.virtual_display.release()
            self.virtual_display = None
        
        if self.media_projection:
            self.media_projection.stop()
            self.media_projection = None
        
        if self.image_reader:
            self.image_reader.close()
            self.image_reader = None
        
        self.capture_button.text = 'Start Screen Capture'
        self.status_label.text = 'Ready'
        self.is_capturing = False

if __name__ == '__main__':
    HUDMirrorApp().run()
