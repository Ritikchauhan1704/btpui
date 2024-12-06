
import { Message } from './types';
// import Image from 'next/image';
import React from 'react';
import Markdown from 'react-markdown';

export default function FullAnswer({
  message,
  onClose,
}: {
  message: Message;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-5 right-0  flex justify-end z-50">
      <div
        className="fixed inset-0"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-lg rounded-l-3xl bg-white shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            
            <span className="ml-2 font-normal text-xs gradient-your-apps">
              AI NOTE
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            {/* <Image
              src={'/search/closeModal.svg'}
              width={20}
              height={20}
              alt="close-sidebar"
            /> */}
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="font-bold text-lg mb-4">Message Title</h2>
          <Markdown className="text-sm leading-relaxed">{message.content}</Markdown>
        </div>

        
      </div>
    </div>
  );
}
