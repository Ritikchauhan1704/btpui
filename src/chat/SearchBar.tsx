
import React, {useEffect, useRef, useState} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Arrow from "./thinDarkRightArrow.svg"
export default function SearchBar({
  sendMessage,
  loading,
}: {
  sendMessage: (message: string, selectedBot: string) => void;
  loading: boolean;
}) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // dummy bot data
  const [bots, setBots] = useState([
    {img: '/new/bot/bot1.svg', name: 'ZSteve'},
    {img: '/new/bot/bot2.svg', name: 'ZSalesCoach'},
    {img: '/new/bot/bot3.svg', name: 'Z'},
    {img: '/new/bot/bot4.svg', name: 'Z'},
  ]);

  const [selectedBot, setSelectedBot] = useState<string>('');
  
  const [message, setMessage] = useState('');

  //  pressing "/" will sets the focus on the textarea element
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === '/') {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
    // setMessage(selectedBot);
  }, [selectedBot]);

  return (
    <form
      className="flex py-2 gap-4 w-full lg:w-[55%] h-16  bg-white border-2 rounded-full justify-center items-center pl-4 pr-2 z-20"
      onSubmit={(e) => {
        if (loading || message.trim().length === 0 ||selectedBot!=="") return;
        e.preventDefault();
        sendMessage(message, selectedBot);
        setMessage('');
        setSelectedBot("")
      }}
      onKeyDown={(e) => {
        if (
          e.key === 'Enter' &&
          !e.shiftKey &&
          !loading &&
          message.trim().length !== 0
        ) {
          sendMessage(message, selectedBot);
          e.preventDefault();
          setMessage('');
          setSelectedBot("")
        }
      }}
    >
      {selectedBot !== '' && (
        <span className="font-bold -mr-4">{selectedBot}</span>
      )}
      <TextareaAutosize
        className="transition bg-white placeholder:text-sm text-sm  resize-none focus:outline-none w-full px-2 max-h-24 lg:max-h-36 xl:max-h-48 flex-grow flex-shrink"
        placeholder={selectedBot!==""?"":"Reply..."}
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={message.trim().length === 0 || loading}
        className={`w-[53px] h-[53px] rounded-full group flex items-center justify-center relative overflow-hidden p-0.5 ${
          loading ? 'gradient-border-hover' : 'no-gradient-border'
        }`}
      >
        <img src={Arrow} alt="right arrow"/>
      </button>
    </form>
  );
}
