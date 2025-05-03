import os
import whisper
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from gtts import gTTS
from .models import AudioConversion
from .serializers import AudioConversionSerializer

class TextToSpeechView(APIView):
    def post(self, request):
        text = request.data.get('text')
        if not text:
            return Response({'error': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create audio file using gTTS
            tts = gTTS(text=text, lang='en')
            
            # Save the conversion to database
            conversion = AudioConversion.objects.create(text=text)
            
            # Generate unique filename
            filename = f'speech_{conversion.id}.mp3'
            filepath = os.path.join(settings.MEDIA_ROOT, 'audio_files', filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Save the audio file
            tts.save(filepath)
            
            # Update the model with the file path
            conversion.audio_file = f'audio_files/{filename}'
            conversion.save()
            
            serializer = AudioConversionSerializer(conversion)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SpeechToTextView(APIView):
    def post(self, request):
        if 'audio' not in request.FILES:
            return Response({'error': 'Audio file is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            audio_file = request.FILES['audio']
            
            # Save the uploaded file temporarily
            temp_path = os.path.join(settings.MEDIA_ROOT, 'temp', audio_file.name)
            os.makedirs(os.path.dirname(temp_path), exist_ok=True)
            
            with open(temp_path, 'wb+') as destination:
                for chunk in audio_file.chunks():
                    destination.write(chunk)
            
            # Load Whisper model and transcribe
            model = whisper.load_model("base")
            result = model.transcribe(temp_path)
            
            # Clean up temporary file
            os.remove(temp_path)
            
            return Response({'text': result['text']}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)