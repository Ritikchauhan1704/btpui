import {useEffect, useState} from 'react';
import { toast } from 'sonner';

export default function useSocket(
  url: string,
  setIsWSReady: (ready: boolean) => void,
  setError: (error: boolean) => void
) {
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!wsInstance) {
      const ws = new WebSocket(url);
      const timeoutId = setTimeout(() => {
        if (ws.readyState !== 1) {
          ws.close();
          setError(true);
            // toast.error(
            //   'Failed to connect to the server. Please try again later.',
            // );
        }
      }, 5000);

      ws.onopen = () => {
        console.log('[DEBUG] open');
        clearTimeout(timeoutId);
        setError(false);
        setIsWSReady(true);
      };

      ws.onerror = () => {
        clearTimeout(timeoutId);
        setError(true);
        // toast.error('WebSocket connection error.');
      };

      ws.onclose = () => {
        clearTimeout(timeoutId);
        setError(true);
        console.log('[DEBUG] closed');
      };
      setWsInstance(ws);
    }
    return () => {
      wsInstance?.close();
      console.log('connection closed');
    };
  }, [wsInstance,url, setIsWSReady, setError]);

  return {wsInstance};
}
