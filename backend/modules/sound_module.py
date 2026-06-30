import io
import soundfile as sf

def get_audio_length(raw_data: bytes) -> float:
    audio_stream = io.BytesIO(raw_data)

    data, sample_rate = sf.read(audio_stream)
    duration_seconds = len(data) / sample_rate
    return duration_seconds

def get_audio_clip_part(raw_data: bytes, duration = 5, start = 0)-> bytes:
    byte_stream = io.BytesIO(raw_data)

    with sf.SoundFile(byte_stream) as f:
        sample_rate = f.samplerate
        subtype = f.subtype

        start_frame = int(start * sample_rate)
        frames_to_read = int(duration * sample_rate)

        f.seek(start_frame)
        audio_data = f.read(frames_to_read)

    output_stream = io.BytesIO()
    sf.write(output_stream, audio_data, sample_rate, format="wav", subtype=subtype)
    return output_stream.getvalue()

