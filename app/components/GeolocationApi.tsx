import React, { useState, useEffect } from "react";

const GeocodeComponent = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Create a controller to cancel the request if the component unmounts
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchLocation = async () => {
      setLoading(true);
      setError(null);

      const ACCESS_KEY = "6770881e3f01db2e8a08da9494fbcd0f";
      const query = "6.6778, 3.1654";
      const url = `http://api.positionstack.com/v1/reverse?access_key=${ACCESS_KEY}&query=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        setData(result.data);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();

    // 2. Cleanup function
    return () => controller.abort();
  }, []); // Re-runs if the address prop changes

  if (loading) return <p>Searching location...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      {data?.map((loc: any, index: number) => (
        <div key={index} className="p-2 border-b">
          <p>{loc.label}</p>
          <span className="text-sm text-gray-500">
            {loc.latitude}, {loc.longitude}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GeocodeComponent;
