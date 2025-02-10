import { useEffect, useState } from "react";

export const Overview = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Virhe haettaessa dataa:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <h1 className="text-4xl font-bold text-blue-600">Overview</h1>
      <p>{message}</p>
    </div>
  );
};
