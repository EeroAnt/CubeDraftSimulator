import "./App.css";
import { NavBar } from "/src/components/NavBar/NavBar";
import { Overview } from "./components/Views/Overview/Overview";
import { useState, useEffect } from "react";


function App() {
  const [loading, setLoading] = useState(true);
  const [showDraftPools, setShowDraftPools] = useState(false);
  const [showColorIdMenu, setShowColorIdMenu] = useState(false);
  const [colorIdState, setColorIdState] = useState("");
  const [draftPoolsState, setDraftPoolsState] = useState("");
  const [mode, setMode] = useState("home");
  const [data, setData] = useState([]);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(baseUrl + "/api/data")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    if (data.single_color_avg_picks) {
      setLoading(false);
    }
  }, [data]);

  return (
    <>
      <NavBar
        showDraftPools={showDraftPools}
        setShowDraftPools={setShowDraftPools}
        showColorIdMenu={showColorIdMenu}
        setShowColorIdMenu={setShowColorIdMenu}
        setColorIdState={setColorIdState}
        setDraftPoolState={setDraftPoolsState}
        setMode={setMode}
        data={data}
      />
      {loading ?
        <div className="mt-10 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div> : null}
      {mode === "home" && !loading ? <Overview data={data} /> : null}
    </>
  );
}

export default App;
