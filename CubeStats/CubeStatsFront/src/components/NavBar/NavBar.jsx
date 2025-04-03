import "./NavBar.css";
import { Button, ButtonWithDropdownMenu } from "../Buttons";
export const NavBar = ({
  showDraftPools,
  setShowDraftPools,
  showColorIdMenu,
  setShowColorIdMenu,
  setColorIdState,
  setDraftPoolState,
  mode,
  setMode,
  data,
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

  const onClickHome = () => {
    setMode("home");
    setShowDraftPools(false);
    setShowColorIdMenu(false);
  };

  const onClickCommanders = () => {
    setMode("commanders");
    setShowDraftPools(false);
    setShowColorIdMenu(false);
  };

  return (
    <nav className="bg-gray-800 p-4" key="NavBar">
      <div
        className="container mx-auto flex justify-between items-center"
        key="NavBarContainer"
      >
        <div className="text-white text-lg font-bold" key="NavBarHeader">
          CubeStats
          <button
            onClick={() => console.log(data)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            thing
          </button>
        </div>
        <div className="space-x-4" key="NavBarButtons">
          <Button
            title={"Home"}
            onClick={onClickHome}
            modeType={mode}
            modeTarget={"home"}
          />
          <ButtonWithDropdownMenu
            title={"Color Identity"}
            items={colorIdItems}
            onClick={onClickColorId}
            state={showColorIdMenu}
            onClickChild={onClickColorIdChild}
            modeType={mode}
            modeTarget={"colorId"}
          />
          <ButtonWithDropdownMenu
            title={"Draft Pools"}
            items={draftPools}
            onClick={onClickDraftPools}
            state={showDraftPools}
            onClickChild={onClickDraftPoolsChild}
            modeType={mode}
            modeTarget={"draftPools"}
          />
          <Button
            title={"Commanders"}
            onClick={onClickCommanders}
            modeType={mode}
            modeTarget={"commanders"}
          />
          {/* {Button("Commanders", OnClickCommanders)} */}
        </div>
      </div>
    </nav>
  );
};
