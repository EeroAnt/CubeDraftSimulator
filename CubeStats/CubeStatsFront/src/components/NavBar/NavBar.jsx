import "./NavBar.css";
import { Button, ButtonWithDropdownMenu } from "../Buttons";
export const NavBar = ({
  showDraftPools,
  setShowDraftPools,
  showColorIdMenu,
  setShowColorIdMenu,
  setColorIdState,
  setDraftPoolState,
  setMode,
}) => {
  const colorIdItems = ["Single Color", "Two Color", "Three Color"];
  const draftPools = [
    "Multicolor",
    "Land",
    "Colorless",
    "White",
    "Blue",
    "Black",
    "Red",
    "Green",
  ];

  const onClickColorId = () => {
    setShowColorIdMenu(!showColorIdMenu);
    setShowDraftPools(false);
  };

  const onClickColorIdChild = (item) => {
    setMode("colorId");
    setColorIdState(item);
    setShowColorIdMenu(false);
  };

  const onClickDraftPools = () => {
    setShowDraftPools(!showDraftPools);
    setShowColorIdMenu(false);
  };

  const onClickDraftPoolsChild = (item) => {
    setMode("draftPools");
    setDraftPoolState(item);
    setShowDraftPools(false);
  };

  function OnClickHome() {
    setMode("home");
    setShowDraftPools(false);
    setShowColorIdMenu(false);
  }
  function OnClickCommanders() {
    setMode("commanders");
    setShowDraftPools(false);
    setShowColorIdMenu(false);
  }

  return (
    <nav className="bg-gray-800 p-4" key="NavBar">
      <div
        className="container mx-auto flex justify-between items-center"
        key="NavBarContainer"
      >
        <div className="text-white text-lg font-bold" key="NavBarHeader">
          CubeStats
        </div>
        <div className="space-x-4" key="NavBarButtons">
          {Button("Home", OnClickHome)}
          {ButtonWithDropdownMenu(
            "Color Identity",
            colorIdItems,
            onClickColorId,
            showColorIdMenu,
            onClickColorIdChild,
          )}
          {ButtonWithDropdownMenu(
            "Draft Pools",
            draftPools,
            onClickDraftPools,
            showDraftPools,
            onClickDraftPoolsChild,
          )}
          {Button("Commanders", OnClickCommanders)}
        </div>
      </div>
    </nav>
  );
};
