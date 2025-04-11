import { PostDraftNavBar, DeckBuilder, SideBar } from "../";
import { useState } from "react";
import './postdraft.css'
import styles from './PostDraft.module.css'
import { sendMessage } from "../../Services";

export function PostDraft({
  connection,
  token,
  main,
  mainColorIdentity,
  side,
  commanders,
  username,
  seatToken,
  showMain,
  setShowMain,
  selectedCards,
  setSelectedCards,
  selectedCommanders,
  setSelectedCommanders,
  lastClicked,
  setLastClicked,
  curveOfMain,
  setCurveOfMain,
  curveOfDisplayed,
  setCurveOfDisplayed,
  maxManaValue,
  setMaxManaValue,
  commanderColorIdentity,
  showDeckbuilder,
  cardsToDisplay,
  setCardsToDisplay,
  typeFilter,
  setTypeFilter,
  colorFilterPos,
  colorFilterNeg,
  setColorFilterPos,
  setColorFilterNeg,
  owner
}) {


  const [basicLands, setBasicLands] = useState([0, 0, 0, 0, 0, 0])

  const renderNavbar = () => {
    return <PostDraftNavBar
      owner={owner}
      connection={connection}
      token={token}
      username={username}
      basicLands={basicLands}
      setBasicLands={setBasicLands}
      commanders={commanders}
      main={main}
      side={side}
    />;
  };


  const selectCards = (card) => {
    setSelectedCommanders([])
    setLastClicked(card)
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card))
    } else {
      setSelectedCards([...selectedCards, card])
    }
  }


  const selectCommander = (card) => {
    setSelectedCards([])
    setLastClicked(card)
    setSelectedCommanders([card])
  }


  const moveCards = () => {
    if (selectedCards.length === 0) {
      alert("No card selected")
    } else {
      const message = {
        type: "Move Cards",
        cards: selectedCards,
        to: showMain ? ("side") : ("main"),
        from: showMain ? ("main") : ("side"),
        token: token
      }
      sendMessage(connection, message)
    }
    setSelectedCards([])
  }


  const renderSideBar = () => {
    return <SideBar
      lastClicked={lastClicked}
      token={token}
      seatToken={seatToken}
      showMain={showMain}
      selectedCommanders={selectedCommanders}
      commanderColorIdentity={commanderColorIdentity}
      commanders={commanders}
      mainColorIdentity={mainColorIdentity}
      main={main}
      side={side}
      selectedCards={selectedCards}
      selectCards={selectCards}
      selectCommander={selectCommander}
      moveCards={moveCards}
      setShowMain={setShowMain}
      setSelectedCards={setSelectedCards}
      connection={connection}
    />
  }


  const renderDeckbuilder = () => {
    return <DeckBuilder
      main={main}
      side={side}
      commanders={commanders}
      showMain={showMain}
      selectedCards={selectedCards}
      selectCards={selectCards}
      cardsToDisplay={cardsToDisplay}
      setCardsToDisplay={setCardsToDisplay}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      curveOfMain={curveOfMain}
      setCurveOfMain={setCurveOfMain}
      curveOfDisplayed={curveOfDisplayed}
      setCurveOfDisplayed={setCurveOfDisplayed}
      maxManaValue={maxManaValue}
      setMaxManaValue={setMaxManaValue}
      commanderColorIdentity={commanderColorIdentity}
      showDeckbuilder={showDeckbuilder}
      colorFilterPos={colorFilterPos}
      colorFilterNeg={colorFilterNeg}
      setColorFilterPos={setColorFilterPos}
      setColorFilterNeg={setColorFilterNeg}
    />;
  };

  return (
    <div className="draft">
      {renderSideBar()}
      <div className={styles.main}>
        {renderNavbar()}
        {renderDeckbuilder()}
      </div>
    </div>
  );
}