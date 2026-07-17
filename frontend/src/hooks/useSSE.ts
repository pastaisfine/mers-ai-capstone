// hooks/useSSE.ts
import { CallTranscriptAPI } from "@/apis/call-transcripts";
import { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";

interface SSEOptions extends AxiosRequestConfig {
  url: string;
}

interface Utterance {}

interface SSEHookResult {
  data: Utterance[] | null;
  error: Error | null;
  isConnected: boolean;
}

export function useSSE(options: SSEOptions): SSEHookResult {
  const [data, setData] = useState<Utterance[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const connect = async () => {
      try {
        // Create a new AbortController for this connection
        controllerRef.current = new AbortController();
        const { signal } = controllerRef.current;

        // Configure Axios for SSE
        const reader = await CallTranscriptAPI.subscribeToTranscriptStream({
          signal,
        });
        const decoder = new TextDecoder("utf-8");

        setIsConnected(true);

        // Process the SSE stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const messages = chunk.split("\n\n").filter(Boolean);

          for (const message of messages) {
            if (message.startsWith("data: ")) {
              try {
                const eventData = JSON.parse(message.substring(6));
                setData(eventData);
              } catch (e) {
                console.error("Failed to parse SSE data:", e);
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsConnected(false);

          // Attempt to reconnect after a delay
          setTimeout(connect, 5000);
        }
      }
    };

    connect();

    // Clean up the connection when the component unmounts
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
      setIsConnected(false);
    };
  }, [options.url]); // Reconnect if URL changes

  return { data, error, isConnected };
}
