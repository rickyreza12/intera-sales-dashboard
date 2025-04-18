
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function useAIFetch(token, question, useLLM = false) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !question) return;

    setAnswer("")
    setLoading(true);
    setError(null);

    const fetchAI = async () => {
      try {
        const endpoint = useLLM ? "real" : "mocked";
        const res = await fetch(`${BASE_URL}/api/ai/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question }),
        });

        const data = await res.json();
        setAnswer(data.answer || "No answer found.");
      } catch (err) {
        console.error("AI fetch error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [token, question]);

  return { answer, loading, error };
}
