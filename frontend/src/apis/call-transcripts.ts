import axios from "axios";

async function subscribeToTranscriptStream({
  signal,
}: {
  signal: AbortSignal;
}): Promise<ReadableStreamDefaultReader> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transcripts/stream`;
  const response = await axios.post(url, undefined, {
    responseType: "stream",
    signal,
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
  return response.data.getReader();
}

export const CallTranscriptAPI = {
  subscribeToTranscriptStream,
};
