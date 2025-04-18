import { useState, useEffect } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function useFetchToken() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch(`${BASE_URL}/api/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: "admin",
            password: "password123",
          }),
        });

        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
      } catch (err) {
        console.error("Token fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, []);

  return { token, loading, error };
}
