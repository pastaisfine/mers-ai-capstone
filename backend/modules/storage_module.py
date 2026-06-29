from io import BufferedReader, FileIO

from storage3.exceptions import StorageApiError
from supabase import create_client

from environment import SUPABASE_URL, SUPABASE_KEY, VOICE_BUCKET_NAME

supabase_client = create_client(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_KEY)

# Download file
def download_file(url) -> bytes | None :
    try:
        response = supabase_client.storage.from_(VOICE_BUCKET_NAME).download(url)
        return response
    except StorageApiError as error:
        if "not found" in error.message:
            return None
        raise error

# Upload file
def upload_file(url: str, file: BufferedReader | bytes | FileIO | str):
    response = (
        supabase_client.storage
        .from_(VOICE_BUCKET_NAME)
        .upload(
            file=file,
            path=url,
            file_options={
                "cache-control": "3600",
                "upsert": 'true',
                "content-type": "audio/wav",
            }
        )
    )
    return response