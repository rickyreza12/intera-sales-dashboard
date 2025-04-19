import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function useAIFetch(token, question, useLLM = false) {
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedMockedFallback, setUsedMockedFallback] = useState(false);

  useEffect(() => {
    if (!token || !question) return;

    setAnswer(null);
    setLoading(true);
    setError(null);
    setUsedMockedFallback(false);

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

        if (res.status === 429 && useLLM) {
          setUsedMockedFallback(true);
          const fallback = await fetch(`${BASE_URL}/api/ai/mocked`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ question }),
          });

          const fallbackData = await fallback.json();
          setAnswer({
            text: fallbackData.answer || "Fallback AI gave no answer.",
            source: "mocked",
            questionUsed: question,
          });
          return;
        }

        const data = await res.json();
        setAnswer({
          text: data.answer || "No answer found.",
          source: useLLM ? "real" : "mocked",
          questionUsed: question,
        });
      } catch (err) {
        console.error("AI fetch error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [token, question]);

  return { answer, loading, error, usedMockedFallback };
}
