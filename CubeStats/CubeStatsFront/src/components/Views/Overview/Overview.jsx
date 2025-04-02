import { useEffect, useState } from "react";

export const Overview = () => {
  const [message, setMessage] = useState("");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(baseUrl + "/api/data")
      .then((res) => res.json())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Virhe haettaessa dataa:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <h1 className="text-4xl font-bold text-blue-600">Overview</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => console.log(message)}>
        Click Me
      </button>
    </div>
  );
};
