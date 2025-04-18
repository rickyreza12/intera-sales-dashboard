import DarkModeIcon from "@/components/icons/DarkModeIcon";

export default function TopNavbar({ toggleDarkMode}) {
    return (
        <div className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 text-black dark:text-white border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4 flex justify-between items-center h-16 dark:shadow-slate-900">
          <h1 className="text-base sm:text-lg font-semibold">Sales Representative Dashboard</h1>
          <div className="text-xl cursor-pointer hover:bg-gray-200 p-2 dark:hover:bg-gray-800 rounded-lg" onClick={toggleDarkMode}>
              <DarkModeIcon className="w-6 h-6 text-gray-700 dark:text-yellow-300" />
          </div>
        </div>
    )
}