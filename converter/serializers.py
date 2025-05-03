from rest_framework import serializers
from .models import AudioConversion

class AudioConversionSerializer(serializers.ModelSerializer):
    audio_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AudioConversion
        fields = ['id', 'text', 'audio_url', 'created_at']
    
    def get_audio_url(self, obj):
        if obj.audio_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.audio_file.url)
        return None