export default function TopReps({ topReps }) {
    return (
      <div className="card bg-white rounded-lg dark:bg-gray-800 shadow px-8 py-6 dark:shadow-slate-900">
        <h3 className="text-md font-semibold mb-4 dark:text-slate-200">
          Top 3 Sales Representative By Revenue
        </h3>
        <div className="flex flex-row justify-center items-center gap-4 p-4">
          {topReps.map((rep, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-20 h-20 sm:w-40 sm:h-40 rounded-full border-4 ${rep.borderColor} overflow-hidden mb-2`}
              >
                <img
                  src={rep.image}
                  alt={rep.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="font-semibold text-base sm:text-2xl dark:text-slate-200">
                {rep.name}
              </p>
              <p className="text-sm sm:text-xl text-gray-600 dark:text-slate-200">
                ${rep.revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  