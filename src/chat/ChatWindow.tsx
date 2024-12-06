import { Message } from './types';
import {useState, useRef, useEffect} from 'react';
import MessageBox from './MessageBox';
import FullAnswer from './FullAnswer';
import SearchBar from './SearchBar';

export default function ChatWindow({
  loading,
  messages,
  sendMessage,
}: {
  loading: boolean;
  messages: Message[];
  sendMessage: (message: string,selectedBot:string) => void;
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // automatic scroll to bottom of screen when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const handleShowSidebar = (message: Message) => {
    setSelectedMessage(message);
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setSelectedMessage(null);
  };

  return (
    <div className="w-screen h-screen flex  items-end">
      <div
        className={`flex-1 flex flex-col justify-between p-10 pt-0 transition-all duration-300 h-full ${
          showSidebar ? 'lg:w-2/3' : 'lg:w-full'
        } items-center`}
        >
        {/* Messages section */}
        <div className="my-10 overflow-y-scroll no-scrollbar w-full lg:w-[60%] h-full">
          {messages?.map((msg, i) => (
            <MessageBox
              key={i}
              message={msg}
              onShowSidebar={handleShowSidebar}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* search bar */}
        <SearchBar loading={loading} sendMessage={sendMessage} />
      </div>
          
      {/* side bar  */}
      {showSidebar && selectedMessage && (
        <div className="w-[40%] h-2/3">
          <FullAnswer message={selectedMessage} onClose={handleCloseSidebar} />
        </div>
      )}
    </div>
  );
}
