import { Button, Image, DraftNavbar, DeckBuilder, SideBar } from "../";
import { useState, useEffect } from "react";
import { sendMessage, getSeatToken } from "../../Services";
import './draft.css'
import styles from './Draft.module.css'


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
  canalDredger,
  queues,
  pack,
  setPack,
  round,
  wizardSelection,
  partnerRules,
  playerTags
}) => {

  const [pick, setPick] = useState(0)
  const [statsButton, setStatsButton] = useState(false);
  const [tagFlow, setTagFlow] = useState({ step: 'idle', tags: [] });
  const [tagInput, setTagInput] = useState('');


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
        token: token,
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
  if (canalDredger === "F" || (pack && pack.length > 1)) {
    return (
      <>
        {tagFlow.step === 'idle' && (
          <Button name="Pick" className="button" onClick={() => selectForTagging()} />
        )}

        {tagFlow.step === 'enterTag' && (
          <div>
            
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="New tag"
            />
            <Button name="Add" className="button" onClick={() => {
              if (tagInput.trim() && !tagFlow.tags.includes(tagInput.trim())) {
                setTagFlow({ ...tagFlow, tags: [...tagFlow.tags, tagInput.trim()] });
                setTagInput('');
              }
            }} />
            {playerTags.length > 0 && playerTags.map(t => (
              <Button
                key={t}
                name={tagFlow.tags.includes(t) ? `✓ ${t}` : t}
                className="button"
                onClick={() => {
                  const updated = tagFlow.tags.includes(t)
                    ? tagFlow.tags.filter(x => x !== t)
                    : [...tagFlow.tags, t];
                  setTagFlow({ ...tagFlow, tags: updated });
                }}
              />
            ))}
            <br />
            <Button
              name={`Done (${tagFlow.tags.length})`}
              className="button"
              onClick={() => {
                setTagFlow({ step: 'chooseDestination', tags: tagFlow.tags });
              }}
            />
            <Button name="Cancel" className="button" onClick={() => {
              setTagFlow({ step: 'idle', tags: [] });
              setTagInput('');
            }} />
          </div>
        )}

        {tagFlow.step === 'chooseDestination' && (
          <div>
            <span>Tag: {tagFlow.tags.join(', ')} →</span>
            <Button name="Main" className="button" onClick={() => confirmPick("main")} />
            <Button name="Side" className="button" onClick={() => confirmPick("side")} />
          </div>
        )}
      </>
    );

  } else {
    return <Button name="Give" className="button" onClick={() => giveAway()} />;
  }
}

  const selectForTagging = () => {
    if (pick) {
      console.log("Main: ", main);
      setTagFlow({ step: 'enterTag', tags: [] });
    } else {
      alert("No card picked");
    }
  }

  const confirmPick = (target) => {
    const message = {
      type: "Pick",
      card: pick,
      zone: target,
      tags: tagFlow.tags,
      token: token
    };
    sendMessage(connection, message);
    setPick(0);
    setPack([]);
    setTagFlow({ step: 'idle', tags: [] });
    setTagInput('');
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
          partnerRules={partnerRules}
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
          round={round}
        />
      </>
    )
  }

  const wizardSelector = (wizardSelection) => {
    const wizards = {
      1: "HOW CAN THIS TAKE SO LONG?!",
      2: "Someone is taking their time...",
      3: "Zzzzz...",
    };
    const wizardImages = {
      1: "/wizards/velho_waiting_angry.png",
      2: "/wizards/velho_waiting_sigh.png",
      3: "/wizards/velho_waiting_yawn.png",
    };

    return (
    <div className={styles.wizardWrapper}>
      <img src={wizardImages[wizardSelection]} alt="Wizard" className={styles.wizardImage} />
      <div className={styles.wizardText}>
        {wizards[wizardSelection] || "Default Placeholder"}
      </div>
    </div>
    )

  };

  const giveAway = () => {
    if (pick) {
      const message = {
        type: "Give Last Card",
        card: pick,
        token: token,
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
          <div className={styles.main}>
            {renderNavbar()}
            <>
              {renderPickButtons()}
              <table className={styles.pack}>
                <tbody>
                  {pack.reduce((rows, card, index) => {
                    if (index % 5 === 0) rows.push([]);
                    rows[rows.length - 1].push(
                      <td key={index} className={pick === card.id ? (styles.selected) : (styles.card)} onClick={() => setPick(card.id)}>
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
          <div className={styles.main}>
            {renderNavbar()}
            <div className={styles.noPackHeader}>
              <h1>Draft</h1>
            </div>
            <div className={styles.noPack}>
              <h2>Waiting for pack</h2>
            </div>
            <div className={styles.noPackWizard}>
              {wizardSelector(wizardSelection)}
            </div>
          </div>
        </>
      );
    }
  } else {
    return (
      <>
        {renderSideBar()}
        <div className={styles.main}>
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