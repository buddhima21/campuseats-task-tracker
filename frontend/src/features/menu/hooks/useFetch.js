import { useState, useEffect } from "react";

const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;

        const controller = new AbortController();

        fetch(`${apiBaseUrl}${url}`, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then((json) => { if (active) setData(json); })
            .catch((err) => {
                if (active && err.name !== "AbortError") setError(err.message);
            })
            .finally(() => {if (active) setIsLoading(false); });
        return () => {
            active = false;
            controller.abort();
        };
    }, [url]);

    return { data, isLoading, error };
}

export default useFetch;