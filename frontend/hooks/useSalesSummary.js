import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function useSalesSummary(token) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null)

   useEffect( () =>{
        if (!token) return;

        const fetchSummary = async () => {
            setLoading(true);
            setError(null);
      
            try {
              const res = await fetch(`${BASE_URL}/api/sales/summary`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
      
              const json = await res.json();
              if (!res.ok) throw new Error(json?.message || "Failed to fetch");
      
              setSummary(json.data);
            } catch (err) {
              console.error("Error fetching summary:", err);
              setError(err.message || "Something went wrong");
            } finally {
              setLoading(false);
            }
          };

        fetchSummary();

        
   }, [token])

    return {summary, loading, error}
}