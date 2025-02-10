import "./App.css";
import { NavBar } from "/src/components/NavBar/NavBar";
import { Overview } from "./components/Views/Overview/Overview";
import { useState } from "react";

function App() {
  const [showDraftPools, setShowDraftPools] = useState(false);
  const [showColorIdMenu, setShowColorIdMenu] = useState(false);
  const [colorIdState, setColorIdState] = useState("");
  const [draftPoolsState, setDraftPoolsState] = useState("");
  const [mode, setMode] = useState("home");
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
      />
      {mode === "home" ? <Overview /> : null}
    </>
  );
}

export default App;
