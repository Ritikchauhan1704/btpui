import { useEffect, useRef, useState } from "react";
import useSocket from "./useSockets";
import { Message } from "./types";
import ChatWindow from "./ChatWindow";

export default function StartChat() {
  // dummy data
  const [messages, setMessages] = useState<Message[]>([
    // {content:"hi",role:"user",bot:""},
    // {content:"hi",role:"zelo",bot:""}
  ]);

  // WebSocket connection status
  const [isWSReady, setIsWSReady] = useState(false);
  const [wsError, setWsError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const url = "ws://127.0.0.1:8000/start";
  const { wsInstance } = useSocket(url, setIsWSReady, setWsError);

  const activeMessageListener = useRef<(e: MessageEvent) => void>();

  useEffect(() => {
    if (!wsError && isWSReady) {
      setIsReady(true);
    }
  }, [wsError, isWSReady]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

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

    if (activeMessageListener.current) {
      wsInstance?.removeEventListener("message", activeMessageListener.current);
    }

    const zeloMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data).content;
      console.log(data);
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

    // Assign the new listener function
    activeMessageListener.current = zeloMessage;

    const getResponse = async () => {
      addMessage({ content: "", role: "zelo", bot: selectedBot });

      // event triggers when backend send a message to frontend
      wsInstance?.addEventListener("message", zeloMessage);
    };

    try {
      await getResponse();
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsStreaming(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-around w-full z-10">
      <ChatWindow
        loading={loading}
        messages={messages}
        sendMessage={sendMessage}
      />
    </div>
  );
}