import {useEffect, useRef, useState} from 'react';
import {toast} from 'sonner';
import useSocket from './useSockets';
import {Message} from './types';
import ChatWindow from './ChatWindow';

export default function StartChat() {

  // dummy data
  const [messages, setMessages] = useState<Message[]>([
  ]);

  // websocket connected with backend?
  const [isWSReady, setIsWSReady] = useState(false);

  // error while connecting with websocket?
  const [wsError, setWsError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // backend websocket endpoint
  const url = `ws://127.0.0.1:8000/start`;

  // getting instance of websockets
  const {wsInstance} = useSocket(url, setIsWSReady, setWsError);

  const messageListenerRef = useRef<(e: MessageEvent) => void | null>(null);

  useEffect(() => {
    if (!wsError && isWSReady) {
      setIsReady(true);
    }
  }, [wsError, isWSReady]);

  const addMessage = (message: Message) => {
    setMessages((messages) => [...messages, message]);
  };

  // sending messages to backend
  const sendMessage = async (message: string, selectedBot: string) => {
    if (loading) return;
    setLoading(true);
    setIsStreaming(true);
    
    addMessage({content: message, role: 'user', bot: selectedBot});
    
    wsInstance?.send(
      JSON.stringify({
        message,
        selectedBot,
      })
    );
    
    // Remove the previous event listener if it exists
    if (messageListenerRef.current) {
      wsInstance?.removeEventListener('message', messageListenerRef.current);
    }
    
    const zeloMessage = (e: MessageEvent) => {
      // e->response from backend
      const data = JSON.parse(e.data);
      addMessage({content: data.content, role: 'zelo', bot: selectedBot});
      // appendMessageToChat(data);
    };

    messageListenerRef.current = zeloMessage;

    const getResponse = async () => {

      addMessage({content: '', role: 'zelo', bot: selectedBot});

      // event triggers when backend send a message to frontend
      wsInstance?.addEventListener('message', zeloMessage);
    };
    try {
      await getResponse();
    } catch {
      // error
    } finally {
      setIsStreaming(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex  h-screen flex-col items-center justify-around w-full z-10">
      <ChatWindow
        loading={loading}
        messages={messages}
        sendMessage={sendMessage}
      />
    </div>
  );
}
