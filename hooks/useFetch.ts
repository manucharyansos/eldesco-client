import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface UseFetchOptions {
  deps?: any[];
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError) => void;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<T>(url);
        setData(response.data);
        options.onSuccess?.(response.data);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        options.onError?.(axiosError);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, options.deps || [url]);

  return { data, loading, error };
}
