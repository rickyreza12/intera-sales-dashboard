import { useEffect, useRef, useState } from "react";
import useAIFetch from "@/hooks/useAIFetch";
import SendIcon from "@/components/icons/SendIcon";

export default function AIChatSidebar({ show, onClose }) {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [messages, setMessages] = useState([])
  const [token, setToken] = useState(null)
  const [useLLM, setUseLLM] = useState(false)

  const { answer, loading, error } = useAIFetch(token, submittedQuestion, useLLM);
  const bottomRef = useRef(null)

  const handleSubmit = () => {
    if(loading) return
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    const thinkingMsg = { role: "ai", text: "..." };

    const updatedMessages = [...messages, userMsg, thinkingMsg];
    setMessages(updatedMessages);
    localStorage.setItem("ai-messages", JSON.stringify(updatedMessages));
    setSubmittedQuestion(question);
    setQuestion("");
  };

  useEffect(() => {
    if(typeof window !== "undefined"){
      const storedtoken = localStorage.getItem("token");
      const savedMessages = localStorage.getItem("ai-messages");

      if(storedtoken) setToken(storedtoken)
      if(savedMessages) setMessages(JSON.parse(savedMessages))
    }
  }, [])

  useEffect(() => {
    if (!loading && submittedQuestion && answer) {
      setMessages((prev) => {
        const newMsgs = [...prev.slice(0, -1), { role: "ai", text: answer }];
        localStorage.setItem("ai-messages", JSON.stringify(newMsgs));
        return newMsgs;
      });
    }

    if (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", text: "Sorry, something went wrong." },
      ]);
    }
  }, [loading, answer, submittedQuestion, error]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      id="ai-panel"
      className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${
        show ? "w-full sm:w-[400px]" : "w-0 overflow-hidden"
      } dark:bg-gray-800 dark:shadow-slate-900`}
    >
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-slate-300">Ask About Sales</h2>
          <div className="flex gap-2 items-center">
            <label className="text-xs dark:text-slate-200">
              Real AI
            </label>
            <button
              onClick={() => setUseLLM(!useLLM)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                useLLM ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  useLLM ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <button onClick={onClose} className="text-lg font-bold dark:text-slate-200">X</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 text-sm pt-2 bg-[#F4F4F4] p-4 sm:p-6 dark:bg-gray-800 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl break-words w-fit max-w-[80%]
                ${
                  msg.role === "user"
                    ? "bg-green-200 text-black"
                    : "bg-blue-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="flex flex-col flex-1">
              
              <input
                type="text"
                value={question}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Type a question..."
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-slate-200 rounded-xl px-3 py-2 text-sm dark:bg-gray-800 dark:text-slate-200"
              />
              <button
                  onClick={() => {
                    setMessages([]);
                    localStorage.removeItem("ai-messages");
                  }}
                  className="text-xs text-gray-500 opacity-50 hover:underline hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-300 self-start mt-2"
                >
                  Clear Chat
                </button>
            </div>

            <div className="group relative">
              <button
                className={`text-white bg-indigo-500 hover:bg-indigo-600 p-2 rounded-full`}
                onClick={handleSubmit}
              >
                <SendIcon className={`w-6 h-6 text-slate-300 dark:text-slate-300`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
