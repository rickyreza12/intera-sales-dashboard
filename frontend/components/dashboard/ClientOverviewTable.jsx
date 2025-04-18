export default function ClientsOverviewTable({ clientsData }) {
    return (
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-4 dark:shadow-slate-900">
        <h3 className="text-md font-semibold mb-4 dark:text-slate-200">Client Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm dark:text-slate-300">
            <thead>
              <tr className="text-left text-gray-500 dark:text-slate-200">
                <th className="pb-2">Client</th>
                <th className="pb-2">Industry</th>
              </tr>
            </thead>
            <tbody>
              {clientsData.map((client, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{client.name}</td>
                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                      {client.industry}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  