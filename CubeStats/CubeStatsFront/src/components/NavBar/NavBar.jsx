import "./NavBar.css";
import { NavBarButton, ButtonWithDropdownMenu } from "../Buttons";
export const NavBar = ({
  showDraftPools,
  setShowDraftPools,
  showColorIdMenu,
  setShowColorIdMenu,
  setColorIdState,
  setDraftPoolState,
  mode,
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

  const onClickHome = () => {
    setMode("home");
    setShowDraftPools(false);
    setShowColorIdMenu(false);
  };

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

  const onClickOverview = () => {
    setMode("overview");
    setShowDraftPools(false);
    setShowColorIdMenu(false);
  };

  const onClickCommanders = () => {
    setMode("commanders");
    setShowDraftPools(false);
    setShowColorIdMenu(false);
  };
  const onClickAllCards = () => {
    setMode("allCards");
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
        </div>
        <img src={"/velho1_whoGoes.png"} alt="Wizard" />
        <div className="flex flex-wrap gap-2 md:gap-4" key="NavBarButtons">
          <NavBarButton
            title={"Home"}
            onClick={onClickHome}
            modeType={mode}
            modeTarget={"home"}
          />
          <NavBarButton
            title={"Overview"}
            onClick={onClickOverview}
            modeType={mode}
            modeTarget={"overview"}
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
          <NavBarButton
            title={"Commanders"}
            onClick={onClickCommanders}
            modeType={mode}
            modeTarget={"commanders"}
          />
          <NavBarButton
            title={"All Cards"}
            onClick={onClickAllCards}
            modeType={mode}
            modeTarget={"allCards"}
          />
          <a
            href="https://github.com/EeroAnt/CubeDraftSimulator"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition inline-flex items-center justify-center h-10"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};
