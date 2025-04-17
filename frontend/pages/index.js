import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DashboardIcon from "@/components/icons/DashboardIcon";
import DarkModeIcon from "@/components/icons/DarkModeIcon";
import AIIcon from "@/components/icons/AIICon";
import EyeIcon from "@/components/icons/EyeIcon";
import dynamic from "next/dynamic"

const MapChart = dynamic(()=> import("@/components/MapChart"), {
  ssr: false
})

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN = process.env.NEXT_PUBLIC_JWT_TOKEN;

export default function Home() {
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedRep, setSelectedRep] = useState(null)
  const [showAIChat, setShowAIChat] = useState(false)

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");

  const regionRevenue = [
    { region: "North America", value: 120000 },
    { region: "Europe", value: 90000 },
    { region: "Asia-Pacific", value: 60000 },
    { region: "South America", value: 80000 },
    { region: "Middle East", value: 95000 },
  ]

  const topReps = [
    {
      name: "Alice",
      revenue: 120000,
      image: "https://api.dicebear.com/7.x/thumbs/svg?seed=Alice",
      borderColor: "border-purple-500"
    },
    {
      name: "Eve",
      revenue: 95000,
      image: "https://api.dicebear.com/7.x/thumbs/svg?seed=Eve",
      borderColor: "border-indigo-500"
    },
    {
      name: "Bob",
      revenue: 90000,
      image: "https://api.dicebear.com/7.x/thumbs/svg?seed=Bob",
      borderColor: "border-blue-400"
    },
  ];

  const dealStatusData = [
    { name: "Closed Won", value: 3 },
    { name: "In Progress", value: 3 },
    { name: "Closed Lost", value: 3 },
  ];

  const clients = [
    { name: "Acme Corp", industry: "Manufacturing" },
    { name: "Kappa LLC", industry: "Retail" },
    { name: "Gamma Enterp", industry: "Tech" },
    { name: "Delta LLC", industry: "Finance" },
    { name: "Epsilon Ltd", industry: "Health Care" },
  ];

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
  

  const mockSalesRepsResponse = {
    statusCode: 200,
    message: "Sales reps data retrieved successfully.",
    pagination: {
      total: 5,
      page: 1,
      size: 10
    },
    data: [
      {
        id: 1,
        name: "Alice",
        role: "Senior Sales Executive",
        region: "North America",
        skills: ["Negotiation", "CRM", "Client Relations"],
        deals: [
          { client: "Acme Corp", value: 120000, status: "Closed Won" },
          { client: "Beta Ltd", value: 50000, status: "In Progress" },
          { client: "Omega Inc", value: 85000, status: "Closed Lost" }
        ],
        clients: [
          { name: "Acme Corp", industry: "Manufacturing", contact: "alice@acmecorp.com" },
          { name: "Beta Ltd", industry: "Retail", contact: "contact@betaltd.com" }
        ],
        deal_total: 3,
        client_total: 2
      },
      {
        id: 2,
        name: "Bob",
        role: "Sales Representative",
        region: "Europe",
        skills: ["Lead Generation", "Presentation", "Negotiation"],
        deals: [
          { client: "Gamma Inc", value: 75000, status: "Closed Lost" },
          { client: "Delta LLC", value: 90000, status: "Closed Won" },
          { client: "Sigma Corp", value: 65000, status: "In Progress" }
        ],
        clients: [
          { name: "Gamma Inc", industry: "Tech", contact: "info@gammainc.com" },
          { name: "Delta LLC", industry: "Finance", contact: "support@deltallc.com" }
        ],
        deal_total: 3,
        client_total: 2
      },
      {
        id: 3,
        name: "Charlie",
        role: "Account Manager",
        region: "Asia-Pacific",
        skills: ["Customer Service", "Sales Strategy", "Data Analysis"],
        deals: [
          { client: "Epsilon Ltd", value: 110000, status: "In Progress" },
          { client: "Zeta Corp", value: 60000, status: "Closed Won" },
          { client: "Theta Enterprises", value: 70000, status: "Closed Lost" }
        ],
        clients: [
          { name: "Epsilon Ltd", industry: "Healthcare", contact: "contact@epsilonltd.com" },
          { name: "Zeta Corp", industry: "Finance", contact: "sales@zetacorp.com" }
        ],
        deal_total: 3,
        client_total: 2
      },
      {
        id: 4,
        name: "Dana",
        role: "Business Development Manager",
        region: "South America",
        skills: ["Strategic Partnerships", "Negotiation", "Market Analysis"],
        deals: [
          { client: "Eta Co", value: 130000, status: "In Progress" },
          { client: "Theta Inc", value: 80000, status: "Closed Won" },
          { client: "Iota Group", value: 55000, status: "Closed Lost" }
        ],
        clients: [
          { name: "Eta Co", industry: "Energy", contact: "info@etaco.com" },
          { name: "Theta Inc", industry: "Telecommunications", contact: "sales@thetainc.com" }
        ],
        deal_total: 3,
        client_total: 2
      },
      {
        id: 5,
        name: "Eve",
        role: "Regional Sales Manager",
        region: "Middle East",
        skills: ["Relationship Building", "Negotiation", "Market Expansion"],
        deals: [
          { client: "Iota Ltd", value: 95000, status: "Closed Won" },
          { client: "Kappa LLC", value: 45000, status: "In Progress" },
          { client: "Lambda Partners", value: 105000, status: "Closed Lost" }
        ],
        clients: [
          { name: "Iota Ltd", industry: "Hospitality", contact: "contact@iotaltd.com" },
          { name: "Kappa LLC", industry: "Retail", contact: "info@kappallc.com" }
        ],
        deal_total: 3,
        client_total: 2
      }
    ]
  };
  

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

  function handleClickOutside(e) {
    const panel = document.getElementById('ai-panel');
    if (panel && !panel.contains(e.target)) {
      setShowAIChat(false);
    }
  }

  const init = async () => {
    // await fetchToken();
    setData(mockSalesRepsResponse.data)
    setLoading(false)
    // await fetchData();
    
  }

  useEffect(() => {
    init();

    if(showAIChat){
      document.addEventListener('mousedown', handleClickOutside);
    }

    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    
  }, [showAIChat]);


  return (
    // <div className="min-h-screen flex bg-gray-50 text-gray-800">
    <div className="min-h-screen">

       {/* Top NavBar  */}
       <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Sales Representative Dashboard</h1>
          <div className="text-xl cursor pointer">
                <DarkModeIcon className="w-6 h-6" />
          </div>
        </div>
      
      {/* SideBar */}
      <div className="fixed top-0 left-0 h-screen w-16 bg-white text-white flex flex-col items-center justify-center gap-4 shadow-sm z-5">
          <div className="group relative">
            <button className="hover:bg-[#0F1B2B]/10 p-2 rounded-md transition duration-200 ease-in-out" onClick={()=>{
              setShowAIChat(false)
            }}
            >
              <DashboardIcon className="w-6 h-6 text-white" />
            </button>
            <div className="tooltip-bubble absolute left-14 top-1/2 -translate-y-1/2 bg-white text-[#0F1B2B] text-sm px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow">
              Dashboard
            </div>
          </div>
          <div className="group relative">
            <button onClick={()=> setShowAIChat(prev => !prev)} className="hover:bg-[#0F1B2B]/10 p-2 rounded-md transition duration-200 ease-in-out">
              <AIIcon className="w-6 h-6 text-white" />
            </button>
            <div className="tooltip-bubble absolute left-14 top-1/2 -translate-y-1/2 bg-white text-[#0F1B2B] text-sm px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow">
                Ask AI
            </div>
          </div>
        </div>

      {/* Main Body  */}
      {
        !loading ? (
          <main className="ml-16 mt-16 p-6 bg-[#F4F4F4] min-h-screen">
          <div className="p-6 grid grid-cols-12 gap-4">

            {/* LEFT COLUMN */}
            <div className="col-span-12 lg:col-span-6 space-y-4">

              {/* Total Revenue + Pipeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-sm text-gray-500">Total Revenue</h3>
                  <p className="text-2xl font-bold">$445,000</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-sm text-gray-500">Pipeline (In Progress)</h3>
                  <p className="text-2xl font-bold">$400,000</p>
                </div>
              </div>

              {/* Revenue By Region */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-md font-semibold mb-4">Revenue By Region</h3>
                    
                    <div className="relative w-full h-[400px] overflow-hidden"> 

                        {/* World Map Chart  */}
                        <div className="absolute inset-0 z-0 ">
                          <MapChart countryRegionMap={countryRegionMap} regionMapColors={regionMapColors}/>
                        </div>

                        {/* Bar Chart */}
                        <div className="absolute z-2 left-[-50px] bottom-6  w-[50%] h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              layout="vertical" 
                              data={regionRevenue} 
                              barCategoryGap={12}
                              margin={{top: 20, right: 30, left: 100, bottom: 20}}
                            >
                              <XAxis type="number" hide />
                              <YAxis dataKey="region" type="category" width={100} 
                                tick={{fontSize: 12, fontWeight: 600}}
                              />
                              <Tooltip 
                                formatter={(value, name) => [`$${value.toLocaleString()}`, "Revenue"]}
                              />
                              <Bar
                                dataKey="value"
                                radius={[0, 6, 6, 0]}
                                isAnimationActive={false}
                              >
                                {regionRevenue.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={regionMapColors[entry.region]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                    </div> 
                  </div>
                
              

              {/* Deal Status + Client Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-md font-semibold mb-4">Deal Status Breakdown</h3>
                  <div className="w-full h-64 flex items-center justify-center">
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie
                        data={dealStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        fill="#5B61F2"
                        // label
                      >
                        {dealStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#4f46e5", "#4338ca", "#06b6d4"][index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                    <div className="mt-4 space-y-1">
                          {
                            dealStatusData.map((entry, index) =>(
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: ["#4f46e5", "#4338ca", "#06b6d4"][index] }}
                                  >
                                  </div>
                                  <span>{entry.name}</span>
                              </div>
                            ))
                          }
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-md font-semibold mb-4">Client Overview</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                          <th className="pb-2">Client</th>
                          <th className="pb-2">Industry</th>
                      </tr>
                    </thead>
                    {clients.map((client, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2">{client.name}</td>
                        <td>
                          <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                            {client.industry}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-12 lg:col-span-6 space-y-4 flex flex-col">

              <div className="bg-white rounded-lg shadow px-8 py-6">
                <h3 className="text-md font-semibold mb-4">Top 3 Sales Representative By Revenue</h3>
                <div className="flex justify-center items-center gap-4 p-4">
                    {
                      topReps.map((rep,index)=>(
                        <div key={index} className="flex flex-col items-center">
                          <div className={`w-40 h-40 rounded-full border-4 ${rep.borderColor} overflow-hidden mb-2`}>
                            <img
                              src={rep.image}
                              alt={rep.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <p className="font-semibold text-xl">{rep.name}</p>
                          <p className="text-sm text-gray-600">${rep.revenue.toLocaleString()}</p>
                        </div>
                      ))
                    }
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex-1">
                <h3 className="text-md font-semibold mb-4">Sales Reps</h3>
                <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-2">Name</th>
                        <th>Region</th>
                        <th>Deals Won</th>
                        <th>Client</th>
                        <th>More</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        data.map((rep, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-2 font-semibold">{rep.name}</td>
                            <td>{rep.region}</td>
                            <td>${rep.deals.reduce((sum, data) => sum + data.value, 0).toLocaleString()}</td>
                            <td>{rep.clients.length}</td>
                            <td>
                            <div className="group relative">
                              <button className="hover:bg-[#0F1B2B]/10 p-2 rounded-md transition duration-200 ease-in-out" onClick={()=> setSelectedRep(rep)}>
                                <EyeIcon className="w-6 h-6 text-white" />
                              </button>
                              <div className="tooltip-bubble absolute left-14 top-1/2 -translate-y-1/2 bg-white text-[#0F1B2B] text-sm px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow">
                                View {rep.name}
                              </div>
                            </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                </table>
              </div>

            </div>
          
            {/* AI Chat Sidebar  */}
            <div 
            id="ai-panel"
            className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-al duration-300 ease-in-out ${showAIChat ? 'w-full sm:w-[400px]' : 'w-0 overflow-hidden'}`}>
              <div className="h-full flex flex-col p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold"> Ask About Sales</h2>
                    <button onClick={()=> setShowAIChat(false)} className="text-lg font-bold"></button>
                </div>

                <div className="flex-1 overflow-y-auto text-center text-gray-400 text-sm pt-10">
                  Ask About Sales
                </div>

                <div className="mt-auto pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        placeholder="Type a questions..."
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <button className="text-white bg-indigo-500 hover:bg-indigo-600 p-2 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.94 2.94a1.5 1.5 0 012.122 0l12 12a1.5 1.5 0 01-2.122 2.122l-12-12a1.5 1.5 0 010-2.122z" />
                        </svg>
                      </button>
                    </div>
                </div>

              </div>

            </div>

          </div>
          {
            selectedRep && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl relative p-14">
                  <button onClick={() => setSelectedRep(null)} className="absolute top-4 right-4 text-lg text-gray-500">X</button>
                  <h2 className="text-3xl font-extrabold mb-4">{selectedRep.name}</h2>
                  
                  <div className="mb-6">
                    <table className="table-auto border-separate border-spacing-x-4 border-spacing-y-4">
                      <tr>
                        <td>Role</td>
                        <td className="font-bold"> {selectedRep.role}</td>
                      </tr>
                      <tr>
                        <td>Region</td>
                        <td className="font-bold"> {selectedRep.region}</td>
                      </tr>
                      <tr>
                        <td>Skills</td>
                        <td>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {
                            selectedRep.skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs rounded-full">{skill}</span>
                            ))
                          }
                        </div>
                        </td>
                      </tr>
                    </table>
                    
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold">Deals</h3>
                    <table className="w-full mt-2 text-sm table-auto border-separate border-spacing-x-4 border-spacing-y-4">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th>Company</th>
                          <th>Value</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          selectedRep.deals.map((deal, idx) => (
                            <tr key={idx} className="border-b">
                              <td>{deal.client}</td>
                              <td>{deal.value.toLocaleString()}</td>
                              <td>
                                <span  className={`text-xs px-2 py-1 rounded-full font-semibold ${deal.status === 'Closed Won' ? 'bg-green-200 text-green-800' : deal.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                                  {deal.status}
                                </span>
                              </td>
                            </tr>

                          ))
                        }
                      </tbody>
                    </table>
                  </div> 

                  <div>
                    <h3 className="font-semibold">Clients</h3>
                    <table className="w-full mt-2 text-sm table-auto border-separate border-spacing-x-4 border-spacing-y-4">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th>Company</th>
                          <th>Industry</th>
                          <th>Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          selectedRep.clients.map((client, idx) => (
                          <tr key={idx} className="border-b">
                            <td>{client.name}</td>
                              <td>
                                <span className="text-xs px-2 py-1 rounded-full bg-[rgba(25,154,246,0.4)] text-black">{client.industry}</span>
                              </td>
                              <td>
                                <a href={`mailto:${client.contact}`} className="text-blue-600 underline text-xs">{client.contact}</a>
                              </td>
                          </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          }
      </main>
        ): (
          <div className="ml-16 mt-16 flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-gray-500 animate-pulse text-xl">Loading Dashboard...</div>
          </div>
        )
      }
      
      
    </div>
  );
}
