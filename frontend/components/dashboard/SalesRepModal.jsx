export default function SalesRepModal({ rep, onClose }) {
    if (!rep) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-700 m-4 sm:m-0 md:m-0 p-4 sm:p-6 md:p-14 rounded-lg shadow-lg w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto relative dark:shadow-slate-900">
                  <button onClick={onClose} className="absolute top-4 right-4 text-lg text-gray-500 dark:text-slate-200">X</button>
                  <h2 className="text-xl sm:text-4xl font-extrabold mb-4 dark:text-slate-200">{rep.name}</h2>
                  
                  <div className="mb-2 sm:mb-6 overflow-x-auto">
                    <table className="w-full table-auto border-separate border-spacing-x-4 border-spacing-y-4 text-sm sm:text-xl dark:text-slate-300">
                      <tr>
                        <td>Role</td>
                        <td className="font-bold"> {rep.role}</td>
                      </tr>
                      <tr>
                        <td>Region</td>
                        <td className="font-bold"> {rep.region}</td>
                      </tr>
                      <tr>
                        <td>Skills</td>
                        <td>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {
                            rep.skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-indigo-100 font-semibold text-indigo-900 text-xs rounded-full">{skill}</span>
                            ))
                          }
                        </div>
                        </td>
                      </tr>
                    </table>
                    
                  </div>

                  <div className="mb-2 sm:mb-4 dark:text-slate-300 text-xl">
                    <h3 className="font-semibold dark:text-slate-200">Deals</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full mt-2 text-sm table-auto border-separate border-spacing-x-4 border-spacing-y-4">
                        <thead>
                          <tr className="text-left text-gray-500 border-b dark:text-slate-300">
                            <th>Company</th>
                            <th>Value</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            rep.deals.map((deal, idx) => (
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
                  </div> 

                  <div>
                    <h3 className="font-semibold dark:text-slate-200">Clients</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full mt-2 text-sm table-auto border-separate border-spacing-x-4 border-spacing-y-4">
                        <thead>
                          <tr className="text-left text-gray-500 border-b dark:text-slate-300">
                            <th>Company</th>
                            <th>Industry</th>
                            <th>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            rep.clients.map((client, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="dark:text-slate-300">{client.name}</td>
                                <td>
                                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[rgba(25,154,246,0.4)] dark:bg-slate-300 text-black">{client.industry}</span>
                                </td>
                                <td>
                                  <a href={`mailto:${client.contact}`} className="text-blue-600 underline text-xs dark:text-slate-200">{client.contact}</a>
                                </td>
                            </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
    );
  }
  