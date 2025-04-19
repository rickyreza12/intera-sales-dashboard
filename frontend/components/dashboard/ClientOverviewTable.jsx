import { useState, useMemo } from "react";

export default function ClientsOverviewTable({ clientsData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredClients = useMemo(() => {
    return clientsData
      .filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortBy].toLowerCase?.() || a[sortBy];
        const valB = b[sortBy].toLowerCase?.() || b[sortBy];

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [clientsData, searchTerm, sortBy, sortAsc]);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredClients.slice(start, start + rowsPerPage);
  }, [filteredClients, currentPage]);

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-4 dark:shadow-slate-900">
      <h3 className="text-md font-semibold mb-4 dark:text-slate-200">Client Overview</h3>

      {/* Search Bar */}
      <div className="flex justify-end mb-2">
        <input
          type="text"
          placeholder="Search clients..."
          className="px-3 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-slate-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm dark:text-slate-300">
          <thead>
            <tr className="text-left text-gray-500 dark:text-slate-200">
              <th
                className="pb-2 cursor-pointer"
                onClick={() => {
                  if (sortBy === "name") setSortAsc(!sortAsc);
                  else {
                    setSortBy("name");
                    setSortAsc(true);
                  }
                }}
              >
                Client
              </th>
              <th
                className="pb-2 cursor-pointer"
                onClick={() => {
                  if (sortBy === "industry") setSortAsc(!sortAsc);
                  else {
                    setSortBy("industry");
                    setSortAsc(true);
                  }
                }}
              >
                Industry
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.map((client, index) => (
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

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 text-xs">
          <span className="text-gray-500 dark:text-slate-300">
            Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredClients.length)} of {filteredClients.length}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700 disabled:opacity-50 dark:text-slate-300"
            >
              Prev
            </button>
            <button
              disabled={currentPage * rowsPerPage >= filteredClients.length}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700 disabled:opacity-50 dark:text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
