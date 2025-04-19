import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function useSalesReps(token, queryParams) {
  const [salesReps, setSalesReps] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, size: 5 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchSalesReps = async () => {
      setLoading(true);
      setError(null);

      const urlParams = new URLSearchParams({
        ...queryParams,
        page: queryParams.page || 1,
        size: queryParams.size || 5,
      });

      try {
        const res = await fetch(`${BASE_URL}/api/sales/sales-reps?${urlParams}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to fetch sales reps");

        setSalesReps(json.data || []);
        setPagination(json.pagination || { total: 0, page: 1, size: 5 });
      } catch (err) {
        console.error("Error fetching sales reps:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReps();
  }, [token, queryParams]);

  return { salesReps, pagination, loading, error };
}
