import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { useState, useEffect } from "react";
import DashboardIcon from "@/components/icons/DashboardIcon";
import DarkModeIcon from "@/components/icons/DarkModeIcon";
import AIIcon from "@/components/icons/AIICon";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN = process.env.NEXT_PUBLIC_JWT_TOKEN;

export default function Home() {
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");

  const fetchToken = async () => {
    try{
      //1. Get token first
      const tokenRes = await fetch(`${BASE_URL}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(
          {
            username: "admin",
            password: "password123"
          }
        )
      })

      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;

      localStorage.setItem("token", token)
      setToken(token);
      fetchData(token)

    }catch (error){
      console.error("Something error while getting the token:", error)
      setLoading(false)
    }
  }

  const fetchData = async () =>{
    try {
      const res = fetch(`${BASE_URL}/sales-reps`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      setData(json.data || [])

      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {

    const init = async () => {
      await fetchToken();
      await fetchData();
    }
    
    init();
  }, []);


  return (
    // <div className="min-h-screen flex bg-gray-50 text-gray-800">
    <div className="min-h-screen font-sans">

       {/* Top NavBar  */}
       <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Sales Representative Dashboard</h1>
          <div className="text-xl cursor pointer">
                <DarkModeIcon className="w-6 h-6" />
          </div>
        </div>
      
      {/* SideBar */}
      <div className="fixed top-0 left-0 h-screen w-16 bg-white text-white flex flex-col items-center justify-center gap-4 shadow-sm z-5">
          <div className="group relative">
            <button className="hover:bg-[#0F1B2B]/10 p-2 rounded-md transition duration-200 ease-in-out">
              <DashboardIcon className="w-6 h-6 text-white" />
            </button>
            <div className="tooltip-bubble absolute left-14 top-1/2 -translate-y-1/2 bg-white text-[#0F1B2B] text-sm px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow">
              Dashboard
            </div>
          </div>
          <div className="group relative">
            <button className="hover:bg-[#0F1B2B]/10 p-2 rounded-md transition duration-200 ease-in-out">
              <AIIcon className="w-6 h-6 text-white" />
            </button>
            <div className="tooltip-bubble absolute left-14 top-1/2 -translate-y-1/2 bg-white text-[#0F1B2B] text-sm px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow">
                Ask AI
            </div>
          </div>
        </div>

      {/* Main Body  */}
      <main className="ml-16 mt-16 p-6 bg-[#F4F4F4] min-h-screen">
        {/* To tal revenue and Pipeline  */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold">$445,000</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-500">Pipeline (In Progress)</h3>
              <p className="text-2xl font-bold">$400,000</p>
            </div>
        </div>
      </main>

    </div>
  );
}
