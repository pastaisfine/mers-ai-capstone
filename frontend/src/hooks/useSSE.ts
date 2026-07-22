import { useEffect, useRef, useState } from "react";

interface Utterance {
  id: string;
  start_duration: number;
  end_duration: number;
  call_id: string;
  transcript: string;
  role: string;
  created_at: string | null;
  updated_at: string | null;
}

interface SSEHookResult<T> {
  data: T | null;
  error: Error | null;
  isConnected: boolean;
}

export function useSSE<T>(
  enabled: boolean,
  connectEventSource: (payload: {
    onopen: ((this: EventSource, ev: Event) => any) | null;
    onmessage: ((this: EventSource, ev: MessageEvent<any>) => any) | null;
    onerror: ((this: EventSource, ev: Event) => any) | null;
  }) => EventSource,
): SSEHookResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const disconnect = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      setIsConnected(false);
    };

    const connect = () => {
      disconnect();

      try {
        const eventSource = connectEventSource({
          onopen: () => {
            setIsConnected(true);
            setError(null);
          },
          onmessage: (event: MessageEvent<any>) => {
            try {
              const eventData = JSON.parse(event.data) as T;
              setData(eventData);
            } catch (parseError) {
              setError(
                parseError instanceof Error
                  ? parseError
                  : new Error(String(parseError)),
              );
            }
          },
          onerror: () => {
            setIsConnected(false);
            eventSource.close();
            eventSourceRef.current = null;

            reconnectTimeoutRef.current = setTimeout(() => {
              if (enabled) {
                connect();
              }
            }, 5000);
          },
        });
        eventSourceRef.current = eventSource;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsConnected(false);
      }
    };

    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled]);

  return { data, error, isConnected };
}
