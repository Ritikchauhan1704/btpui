import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Arrow from "./thinDarkRightArrow.svg";
import LLM from "../assets/x1.png";

export default function SearchBar({
  sendMessage,
  loading,
}: {
  sendMessage: (message: string, selectedBot: string) => void;
  loading: boolean;
}) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);


  const [selectedBot, setSelectedBot] = useState<string>("");
  const [message, setMessage] = useState("");
  const [hasEnteredPrompt, setHasEnteredPrompt] = useState(false); // Track if the user entered a prompt

  // pressing "/" will sets the focus on the textarea element
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedBot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || message.trim().length === 0 || selectedBot !== "") return;

    // Send the message
    sendMessage(message, selectedBot);

    // Mark that the user has entered a prompt and hide the heading/image
    setHasEnteredPrompt(true);

    // Reset message and selectedBot state
    setMessage("");
    setSelectedBot("");
  };

  return (
    <>
{!hasEnteredPrompt && (
        <div className="flex flex-col items-center justify-center w-full  py-12 mb-20">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
              Health LLM
            </h1>
            <p className="text-xl text-gray-600">
              Describe your symptoms, and let us assist with personalized health
              predictions.
            </p>
          </div>
          <img
            src={LLM}
            alt="Health Assistant"
            className="w-auto h-auto max-w-[400px] mx-auto shadow-md "
          />
        </div>
      )}
      <form
        className={`flex py-2 gap-4 w-full lg:w-[55%] h-16 bg-white border-2 rounded-full justify-center items-center pl-4 pr-2 z-20`}
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey &&
            !loading &&
            message.trim().length !== 0
          ) {
            handleSubmit(e);
            e.preventDefault();
          }
        }}
      >
        {selectedBot !== "" && (
          <span className="font-bold -mr-4">{selectedBot}</span>
        )}
        <TextareaAutosize
          className="transition bg-white placeholder:text-sm text-sm resize-none focus:outline-none w-full px-2 max-h-24 lg:max-h-36 xl:max-h-48 flex-grow flex-shrink"
          placeholder={selectedBot !== "" ? "" : "Reply..."}
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={message.trim().length === 0 || loading}
          className={`w-[53px] h-[53px] rounded-full group flex items-center justify-center relative overflow-hidden p-0.5 ${
            loading ? "gradient-border-hover" : "no-gradient-border"
          }`}
        >
          <img src={Arrow} alt="right arrow" />
        </button>
      </form>
    </>
  );
}
