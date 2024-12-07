import { useEffect, useRef, useState } from "react";
import useSocket from "./useSockets";
import { Message } from "./types";
import ChatWindow from "./ChatWindow";

export default function StartChat() {
  // dummy data
  const [messages, setMessages] = useState<Message[]>([]);

  // websocket connected with backend?
  const [isWSReady, setIsWSReady] = useState(false);

  // error while connecting with websocket?
  const [wsError, setWsError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // backend websocket endpoint
  const url = "ws://127.0.0.1:8000/start";

  // getting instance of websockets
  const { wsInstance } = useSocket(url, setIsWSReady, setWsError);

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

    addMessage({ content: message, role: "user", bot: selectedBot });

    wsInstance?.send(
      JSON.stringify({
        message,
        selectedBot,
      })
    );

    // Remove the previous event listener if it exists
    if (messageListenerRef.current) {
      wsInstance?.removeEventListener("message", messageListenerRef.current);
    }

    const zeloMessage = (e: MessageEvent) => {
      // e->response from backend
      // console.log(e.data);
      const data = JSON.parse(e.data).content;
      console.log(data);
      // console.log(typeof data);
      // console.log(data['predicted_precautions']);
      // data=JSON.parse(data)

      // Format the response into readable English
      const formattedResponse = `
        Predicted disease: ${data.predicted_disease || "Not available"}
    
        Precautions for this disease: ${
          data.predicted_precautions.length > 0
            ? data.predicted_precautions.join(", ")
            : "No precautions available."
        }
    
        Other likely diseases and their precautions:
        ${data.other_diseases
          .map((disease) => {
            return `${disease.disease}: ${disease.precautions.join(", ")}`;
          })
          .join("\n")}
      `;

      // Add the formatted message to the chat
      addMessage({
        content: formattedResponse,
        role: "zelo",
        bot: selectedBot,
      });

      // Debug log to check if the message is correctly added to state
      console.log("Formatted Response added to messages:", formattedResponse);
    };

    messageListenerRef.current = zeloMessage;

    const getResponse = async () => {
      addMessage({ content: "", role: "zelo", bot: selectedBot });

      // event triggers when backend send a message to frontend
      wsInstance?.addEventListener("message", zeloMessage);
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