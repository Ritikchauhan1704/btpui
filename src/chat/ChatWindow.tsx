import { Message } from './types';
import { useRef, useEffect } from 'react';
import MessageBox from './MessageBox';
import SearchBar from './SearchBar';

export default function ChatWindow({
  loading,
  messages,
  sendMessage,
}: {
  loading: boolean;
  messages: Message[];
  sendMessage: (message: string, selectedBot: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Automatic scroll to bottom of screen when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-screen h-screen flex items-end">
      <div className="flex-1 flex flex-col justify-between p-10 pt-0 h-full items-center">
        {/* Messages section */}
        <div className="my-10 overflow-y-scroll no-scrollbar w-full lg:w-[60%] h-full">
          {messages?.map((msg, i) => (
            <MessageBox key={i} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Search bar */}

        {/* Search bar */}
        <SearchBar loading={loading} sendMessage={sendMessage} />
      </div>
    </div>
  );
}
