import React from "react";

const useQuery = <T>(key: string, url: string, options?: RequestInit): readonly [T | undefined, Error | null, boolean] => {
  const [data, setData] = React.useState<T>();
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, url, JSON.stringify(options)]); // Stringify options to prevent infinite re-renders

  return [data, error, loading] as const;
};

export default useQuery;