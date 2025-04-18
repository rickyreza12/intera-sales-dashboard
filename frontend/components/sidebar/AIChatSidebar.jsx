import { useEffect, useRef, useState } from "react";
import useAIFetch from "@/hooks/useAIFetch";
import SendIcon from "@/components/icons/SendIcon";

export default function AIChatSidebar({ show, onClose }) {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [messages, setMessages] = useState([])
  const [token, setToken] = useState(null)

  const { answer, loading, error } = useAIFetch(token, submittedQuestion);
  const bottomRef = useRef(null)

  const handleSubmit = () => {
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
    // 👇 this will always scroll to bottom smoothly
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
          <button onClick={onClose} className="text-lg font-bold dark:text-slate-200">
            X
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 text-sm pt-2 bg-[#F4F4F4] p-4 sm:p-6 dark:bg-gray-800 rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`px-4 py-2 mb-4 rounded-xl break-words w-fit max-w-[80%]
                ${
                  msg.role === "user"
                    ? "ml-auto bg-green-200 text-black"
                    : "mr-auto bg-[#F4F4F4] dark:bg-gray-700 text-gray-800 dark:text-white"
                }
              `}
              style={{ marginLeft: msg.role === "user" ? "8em" : "0" }}
            >
              {msg.text}
            </div>
          ))}
        </div>


        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center gap-2">
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

            <div className="group relative">
              <button
                className={`text-white bg-indigo-500 hover:bg-indigo-600 p-2 rounded-full`}
                onClick={handleSubmit}
              >
                <SendIcon className={`w-6 h-6 text-slate-300 dark:text-indigo-600`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
