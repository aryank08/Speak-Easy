from django.db import models

class AudioConversion(models.Model):
    text = models.TextField()
    audio_file = models.FileField(upload_to='audio_files/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Conversion {self.id} - {self.created_at}"