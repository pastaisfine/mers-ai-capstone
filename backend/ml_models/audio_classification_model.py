import io

from torch import FloatTensor

from self_hosted_device import self_host_device
import torch
from transformers import AutoModelForAudioClassification, AutoFeatureExtractor, AutoProcessor
import numpy as np
import soundfile as sf
model_id = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"

processor = AutoProcessor.from_pretrained(model_id)
print("Processor loaded completely")
model = AutoModelForAudioClassification.from_pretrained(model_id,
                                                        dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
print("Model loaded into RAM successfully!")
feature_extractor = AutoFeatureExtractor.from_pretrained(model_id, do_normalize=True)
print("Feature extractor loaded completely")
id2label = model.config.id2label
print("id2Label loaded completely")


def preprocess_audio(audio_bytes, max_duration=30.0):
    audio_array, sampling_rate = sf.read(io.BytesIO(audio_bytes))

    max_length = int(feature_extractor.sampling_rate * max_duration)
    if len(audio_array) > max_length:
        audio_array = audio_array[:max_length]
    else:
        audio_array = np.pad(audio_array, (0, max_length - len(audio_array)))

    inputs = feature_extractor(
        audio_array,
        sampling_rate=feature_extractor.sampling_rate,
        max_length=max_length,
        truncation=True,
        return_tensors="pt",
    )
    return inputs


def generate_emotion_logits(audio_path, max_duration=30.0) -> FloatTensor | None:
    inputs = preprocess_audio(audio_path, max_duration)
    inputs = {key: value.to(self_host_device) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    return outputs.logits

def predict_emotion_from_logits(logits: FloatTensor):
    predicted_id = torch.argmax(logits, dim=-1).item()
    predicted_label = id2label[predicted_id]

    return predicted_label
