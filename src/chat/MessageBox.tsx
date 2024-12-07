import { Message } from './types';
export default function MessageBox({
  message,
}: {
  message: Message;
}) {
  return (
    <div className="relative w-full">
      {/* User message */}
      {message.role === 'user' && (
        <div className="flex justify-end items-start my-4">
          <div className="max-w-[50%] text-sm bg-white px-5 py-3 rounded-2xl mr-2">
            <p>
              <span className="font-bold">{message.bot} </span>
              {message.content}
            </p>
          </div>
          <div className="rounded-full flex justify-center items-center bg-blue-500 text-xs text-white w-6 h-6">
            R
          </div>
        </div>
      )}

      {/* Zelo response */}
      {message.role === 'zelo' && (
        <div className="flex flex-col w-full items-start">
          <div className="flex">
            <div className="w-full text-sm">
                {message.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
