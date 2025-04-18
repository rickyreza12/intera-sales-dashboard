import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import LayoutWrapper from "@/components/layout/LayoutWrapper";

import EyeIcon from "@/components/icons/EyeIcon";
import dynamic from "next/dynamic"
import useSalesSummary from "@/hooks/useSalesSummary";
import useDealStatus from "@/hooks/useDealStatus";
import useClientsOverview from "@/hooks/useClientsOverview";
import useSalesReps from "@/hooks/useSalesReps";
import useTopReps from "@/hooks/useTopReps";
import TopNavbar from "@/components/layout/TopNavbar";
import Sidebar from "@/components/layout/Sidebar";
import SummaryCards from "@/components/dashboard/SummaryCards";
import RevenueRegionChart from "@/components/dashboard/RevenueRegionChart.";
import DealStatusPie from "@/components/dashboard/DealStatusPie";
import ClientsOverviewTable from "@/components/dashboard/ClientOVerviewTable";
import TopReps from "@/components/dashboard/TopReps";
import SalesRepsTable from "@/components/dashboard/SalesRepsTable";
import SalesRepModal from "@/components/dashboard/SalesRepModal";
import AIChatSidebar from "@/components/sidebar/AIChatSidebar";

const MapChart = dynamic(()=> import("@/components/MapChart"), {
  ssr: false
})

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN = process.env.NEXT_PUBLIC_JWT_TOKEN;

export default function Home() {
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRep, setSelectedRep] = useState(null)
  const [selectedTooltip, setSelectedTooltip] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showAIChat, setShowAIChat] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // const [data, setData] = useState([]);
  const [token, setToken] = useState("");

  const {summary, loadingSummary, errorSummary} = useSalesSummary(token);
  const {dealStatusData, loadingDeal, errorDeals} = useDealStatus(token);
  const {clientsData, loadingClient, serrorClient} = useClientsOverview(token);
  const {topReps, loadingTopRep, errorTopRep} = useTopReps(token);
  const {salesReps, loadingSalesRep, errorSalesRep} = useSalesReps(token);
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


  const regionMapColors = {
    "North America": "#7C3AED",   // violet
    "Europe": "#2563EB",          // blue
    "Asia-Pacific": "#10B981",    // green
    "South America": "#06B6D4",   // cyan
    "Middle East": "#F59E0B",     // amber
  };

  const countryRegionMap = {
      // North America
    USA: "North America",
    CAN: "North America",
    MEX: "North America",

    // Europe
    FRA: "Europe",
    DEU: "Europe",
    ESP: "Europe",
    GBR: "Europe",
    ITA: "Europe",
    NOR: "Europe",
    SWE: "Europe",
    POL: "Europe",
    UKR: "Europe",
    RUS: "Europe",

    // Asia-Pacific
    CHN: "Asia-Pacific",
    JPN: "Asia-Pacific",
    AUS: "Asia-Pacific",
    IDN: "Asia-Pacific",
    IND: "Asia-Pacific",
    KOR: "Asia-Pacific",

    // South America
    BRA: "South America",
    ARG: "South America",
    COL: "South America",
    CHL: "South America",
    PER: "South America",

    // Middle East
    SAU: "Middle East",
    ARE: "Middle East",
    IRN: "Middle East",
    ISR: "Middle East",
    TUR: "Middle East",
  };
  

  function handleClickOutside(e) {
    const panel = document.getElementById('ai-panel');
    if (panel && !panel.contains(e.target)) {
      setShowAIChat(false);
    }
  }

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
      // fetchData(token)
      return token;
    }catch (error){
      console.error("Something error while getting the token:", error)
      setLoading(false)
    }
  }


  const init = async () => {
    await fetchToken();
    setLoading(false)    
  }

  useEffect(() => {
    init();

    if(showAIChat){
      document.addEventListener('mousedown', handleClickOutside);
    }

    if(isDarkMode){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }

    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    
  }, [showAIChat, isDarkMode]);


  return (
    // <div className="min-h-screen flex bg-gray-50 text-gray-800">
    <LayoutWrapper>

       {/* Top NavBar  */}
       <TopNavbar toggleDarkMode={() => setIsDarkMode(prev => !prev)}/>
      
      {/* SideBar */}
      <Sidebar showAIChat={showAIChat} toggleAIChat={setShowAIChat}/>

      {/* Main Body  */}
      {
        !loading ? (
          <main className="m-0 sm:ml-16 mt-16 mb-10 sm:mb-0 p-6 bg-[#F1F1F1] dark:bg-gray-600 min-h-screen">
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* LEFT COLUMN */}
            <div className="col-span-12 lg:grid-cols-2 lg:col-span-6 space-y-4">

              {/* Total Revenue + Pipeline */}
              <SummaryCards summary={summary}/>

              {/* Revenue By Region */}
              <RevenueRegionChart 
                summary={summary}
                isDarkMode={isDarkMode}
                countryRegionMap={countryRegionMap}
                regionMapColors={regionMapColors}
              />

              {/* Deal Status + Client Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                <DealStatusPie dealStatusData={dealStatusData} />

                <ClientsOverviewTable clientsData={clientsData} />
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-12 lg:grid-cols-2 lg:col-span-6 space-y-4 flex flex-col">

              {/* TOP 3 REPS  */}
              <TopReps topReps={topReps} />

              {/* Sales Reps  */}
              <SalesRepsTable 
                salesReps={salesReps}
                regionMapColors={regionMapColors}
                selectedTooltip={selectedTooltip}
                tooltipPosition={tooltipPosition}
                setSelectedRep={setSelectedRep}
                setSelectedTooltip={setSelectedTooltip}
                setTooltipPosition={setTooltipPosition}
              />


            </div>
          
            {/* AI Chat Sidebar  */}
            <AIChatSidebar show={showAIChat} onClose={() => setShowAIChat(false)} />            
          </div>
          {/* MODAL  SALES REP */}
          {
            selectedRep && (
              <SalesRepModal
                rep={selectedRep}
                onClose={() => setSelectedRep(null)}
              />
            )
          }
      </main>
        ): (
          <div className="ml-16 mt-16 flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-gray-500 animate-pulse text-xl">Loading Dashboard...</div>
          </div>
        )
      }
      
      
    </LayoutWrapper>
  );
}
