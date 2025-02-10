import "./App.css";
import { NavBar } from "/src/components/NavBar/NavBar";
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
      {mode === "home" ? <h1>Welcome to Eero&apos;s Cube Stats</h1> : null}
    </>
  );
}

export default App;
