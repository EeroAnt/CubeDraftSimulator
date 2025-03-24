import { Button, Image, DraftNavbar, DeckBuilder, SideBar } from "../";
import { useState, useEffect } from "react";
import { sendMessage, getSeatToken } from "../../Services";
import './draft.css'


export const Draft = ({
  connection,
  token,
  main,
  side,
  commanders,
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
  mainColorIdentity,
  showDeckbuilder,
  setShowDeckbuilder,
  cardsToDisplay,
  setCardsToDisplay,
  typeFilter,
  setTypeFilter,
  colorFilterPos,
  colorFilterNeg,
  setColorFilterPos,
  setColorFilterNeg,
  canalDredgerOwner,
  canalDredger,
  queues,
  pack,
  setPack
}) => {

  const [pick, setPick] = useState(0)
  const [statsButton, setStatsButton] = useState(false);

  useEffect(() => {
    if (!seatToken) {
      getSeatToken(connection)
    }
  }, [])

  useEffect(() => {
    setStatsButton(main.concat(side).concat(commanders).length > 5);
  }, [main, side, commanders]);

  useEffect(() => {

    const newMaxManaValue = Math.max(...main.concat(side).concat(commanders).map(obj => obj.mana_value));
    setMaxManaValue(newMaxManaValue);

    const mainWithoutLands = main.filter(card => !card.types.includes("Land"))
    const newCurveOfMain = Array.from({ length: newMaxManaValue + 1 }, (_, index) => mainWithoutLands.concat(commanders).filter(card => card.mana_value === index).length);

    setCurveOfMain(newCurveOfMain)
    setCurveOfDisplayed(newCurveOfMain);

  }, [main, side, commanders])


  const selectCards = (card) => {

    setSelectedCommanders([])
    setLastClicked(card)

    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card))
    } else {
      setSelectedCards([...selectedCards, card])
    }
  }

  const moveCards = () => {

    if (selectedCards.length === 0) {
      alert("No card selected")
    } else {
      const message = {
        type: "Move Cards",
        cards: selectedCards,
        to: showMain ? ("side") : ("main"),
        from: showMain ? ("main") : ("side")
      };
      sendMessage(connection, message)
    }
    setSelectedCards([])
  }

  const selectCommander = (card) => {
    setSelectedCards([])
    setLastClicked(card)
    setSelectedCommanders([card])
  }

  const renderPickButtons = () => {
    if (canalDredgerOwner === "T" || canalDredger === "F" || (pack && pack.length > 1)) {
      return (
        <>
          <Button name="Pick to main" className="button" onClick={() => confirmPick("main")} />
          <Button name="Pick to side" className="button" onClick={() => confirmPick("side")} />
        </>)
    } else {
      return (
        <>
          <Button name="Give" onClick={() => giveAway()} />
        </>
      )
    }
  }

  function renderSideBar() {
    return (
      <>
        <SideBar
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
      </>
    )
  }

  function renderNavbar() {
    return (
      <>
        <DraftNavbar
          onClickNavbar={() => setShowDeckbuilder(!showDeckbuilder)}
          buttonName={showDeckbuilder ? ("Show Draft") : ("Show Stats")}
          queues={queues}
          statsButton={statsButton}
        />
      </>
    )
  }

  const confirmPick = (target) => {
    if (pick) {
      const message = {
        type: "Pick",
        card: pick,
        zone: target,
        token: token
      }
      sendMessage(connection, message)
      setPick(0)
      setPack([])
    } else {
      console.log("No card picked")
    }
  }

  const giveAway = () => {
    if (pick) {
      const message = {
        type: "Give Last Card",
        card: pick,
        token: token,
        seat: canalDredgerOwner
      }
      sendMessage(connection, message)
      setPick(0)
      setPack([])
    } else {
      console.log("No card picked")
    }
  }


  if (!showDeckbuilder) {
    if (pack && pack.length > 0) {
      return (
        <>
          {renderSideBar()}
          <div className="main">
            {renderNavbar()}
            <>
              {renderPickButtons()}
              <table className="pack">
                <tbody>
                  {pack.reduce((rows, card, index) => {
                    if (index % 5 === 0) rows.push([]);
                    rows[rows.length - 1].push(
                      <td key={index} className={pick === card.id ? ("selected") : ("card")} onClick={() => setPick(card.id)}>
                        <Image imageUrl={card.image_url} backsideUrl={card.backside_image_url} />
                      </td>
                    );
                    return rows;
                  }, []).map((row, rowIndex) => (
                    <tr key={rowIndex}>{row}</tr>
                  ))}
                </tbody>
              </table>
            </>
          </div>
        </>
      );
    } else {
      return (
        <>
          {renderSideBar()}
          <div className="main">
            {renderNavbar()}
            <h1>Draft</h1>
            <h2>Waiting for pack</h2>
          </div>
        </>
      );
    }
  } else {
    return (
      <>
        {renderSideBar()}
        <div className="main">
          {renderNavbar()}
          <DeckBuilder
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
          />
        </div>
      </>
    )
  }
}