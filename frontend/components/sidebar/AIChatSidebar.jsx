import { useState } from "react";
import useAIFetch from "@/hooks/useAIFetch";
import SendIcon from "../icons/SendIcon";

export default function AIChatSidebar({ show, onClose }) {
    const [question, setQuestion] = useState("");
    const [submittedQuestion, setSubmittedQuestion] = useState("");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const {answer, loading, error} = useAIFetch(token, submittedQuestion);

    const handleSubmit = () => {
      setSubmittedQuestion(question)
    }

    return (
      <div 
        id="ai-panel"
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${
          show ? 'w-full sm:w-[400px]' : 'w-0 overflow-hidden'
        } dark:bg-gray-800 dark:shadow-slate-900`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-slate-300">Ask About Sales</h2>
            <button onClick={onClose} className="text-lg font-bold dark:text-slate-200">X</button>
          </div>
  
          <div className="flex-1 overflow-y-auto text-center text-gray-400 text-sm pt-10">
            {loading ? (
              <p className="text-center text-gray-400 mt-10">Thinking...</p>
            ) : error ? (
              <p className="text-center text-red-500 mt-10">{error}</p>
            ) : answer ? (
              <div className="mt-2 whitespace-pre-wrap">{answer}</div>
            ) : (
              <p className="text-center text-gray-400 mt-10">Ask About Sales</p>
            )}
          </div>
  
          <div className="mt-auto pt-4 border-t">
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={question}
                placeholder="Type a question..."
                onChange={(e) =>setQuestion(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-slate-200 rounded-xl px-3 py-2 text-sm dark:bg-gray-800 dark:text-slate-200"
              />

              <div className="group relative">
                <button className={`text-white bg-indigo-500 hover:bg-indigo-600 p-2 rounded-full`}
                onClick={handleSubmit}
                >
                  <SendIcon className={
                    `w-6 h-6 text-slate-300 dark:text-indigo-600`
                  } />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  