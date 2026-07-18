function connectTranscriptEventSource({
  onopen,
  onmessage,
  onerror,
}: {
  onopen: ((this: EventSource, ev: Event) => any) | null;
  onmessage: ((this: EventSource, ev: MessageEvent<any>) => any) | null;
  onerror: ((this: EventSource, ev: Event) => any) | null;
}): EventSource {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transcripts/stream`;
  const eventSource = new EventSource(url);
  eventSource.onopen = onopen;
  eventSource.onmessage = onmessage;
  eventSource.onerror = onerror;
  return eventSource;
}

export const CallTranscriptAPI = { connectTranscriptEventSource };
