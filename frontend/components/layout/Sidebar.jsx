import AIIcon from "@/components/icons/AIIcon"
import DashboardIcon from "@/components/icons/DashboardIcon"

export default function Sidebar({showAIChat, toggleAIChat}){
    return (
        <div className="fixed bottom-0 sm:top-0 left-0 sm:h-screen w-full sm:w-16 bg-white dark:bg-gray-800 text-white flex sm:flex-col flex-row items-center justify-around sm:justify-center gap-4 shadow-sm z-10 sm:z-5 dark:shadow-slate-900">
          <div className="group relative">
            <button className={`p-2 ${showAIChat ? 'hover:bg-[#0F1B2B]/10 dark:hover:bg-gray-500 rounded-md transition duration-200 ease-in-out': '' } `}
            disabled={!showAIChat}
             onClick={()=>{
              toggleAIChat(false)
            }}
            >
              <DashboardIcon className={
                `w-6 h-6 ${!showAIChat? 'text-indigo-400' : 'text-gray-700 dark:text-slate-300'}`
              } />
            </button>
            <div className="tooltip-bubble absolute left-14 top-1/2 -translate-y-1/2 bg-white text-[#0F1B2B] text-sm px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow dark:bg-gray-800 dark:text-slate-300">
              Dashboard
            </div>
          </div>
          <div className="group relative">
            <button onClick={()=> toggleAIChat(true)}
              disabled={showAIChat}
              className={`p-2 ${!showAIChat ? 'hover:bg-[#0F1B2B]/10 dark:hover:bg-gray-500 rounded-md transition duration-200 ease-in-out' : ''}`}>
            <AIIcon className={
                `w-6 h-6 ${showAIChat? 'text-indigo-400' : 'text-gray-700 dark:text-slate-300'}`
              } />
            </button>
            <div className="tooltip-bubble absolute left-14 top-1/2 -translate-y-1/2 bg-white text-[#0F1B2B] text-sm px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow dark:bg-gray-800 dark:text-slate-300">
                Ask AI
            </div>
          </div>
        </div>
    )
}