import { Button, Image, DraftNavbar, DeckBuilder, SideBar } from "../";
import { useState, useEffect } from "react";
import './draft.css'


export const Draft = ({
	setMode,
	connection,
	token,
	main,
	setMain,
	side,
	setSide,
	commanders,
	setCommanders,
	username,
	seatToken,
	setSeatToken,
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
	setCommanderColorIdentity,
	showDeckbuilder,
	setShowDeckbuilder,
	cardsToDisplay,
	setCardsToDisplay,
	typeFilter,
	setTypeFilter,
	colorFilterPos,
	colorFilterNeg,
	setColorFilterPos,
	setColorFilterNeg
 }) => {

  const [pack, setPack] = useState([])
  const [pick, setPick] = useState(0)
  const [onTheLeft, setOnTheLeft] = useState("")
  const [onTheRight, setOnTheRight] = useState("")
  const [direction, setDirection] = useState(0)
  const [canalDredger, setCanalDredger] = useState(false)
  const [canalDredgerOwner, setCanalDredgerOwner] = useState(-1)


  useEffect(() => {
	setMaxManaValue(Math.max(...main.concat(side).concat(commanders).map(obj => obj.mana_value)));
	if (commanders.length === 0) {
	  setCommanderColorIdentity(["C"])
	} else if (commanders.length === 1) {
	  setCommanderColorIdentity(commanders[0].color_identity.split(""))
	} else {
	  const combined = commanders[0].color_identity.split("").concat(commanders[1].color_identity.split(""))
	  const unique = [...new Set(combined)]
	  unique.length < 2 ? setCommanderColorIdentity(unique) : setCommanderColorIdentity(unique.filter(color => color !== "C"))
	}

	const mainWithoutLands = main.filter(card => !card.types.includes("Land"))
	setCurveOfMain(Array.from({ length: maxManaValue + 1 }, (_, index) => mainWithoutLands.concat(commanders).filter(card => card.mana_value === index).length))
	setCurveOfDisplayed(curveOfMain);
  }, [main, side, commanders ])


  useEffect(() => {
	if (connection.lastJsonMessage && connection.lastJsonMessage.type === "Pack") {
	  setPack(connection.lastJsonMessage.pack)
	} else if (connection.lastJsonMessage && connection.lastJsonMessage.type === "End Draft") {
	  setMode("DeckBuilder")
	} else if (connection.lastJsonMessage && connection.lastJsonMessage.type === "Picked Cards") {
	  setMain(connection.lastJsonMessage.main)
	  setSide(connection.lastJsonMessage.side)
	  setCommanders(connection.lastJsonMessage.commanders)
	} else if (connection.lastJsonMessage && connection.lastJsonMessage.type === "Neighbours") {
	  setOnTheLeft(connection.lastJsonMessage.left)
	  setOnTheRight(connection.lastJsonMessage.right)
	  setDirection(connection.lastJsonMessage.direction)
	  setSeatToken(connection.lastJsonMessage.seatToken)
	} else if (connection.lastJsonMessage && connection.lastJsonMessage.type === "Canal Dredger") {
	  console.log("canal dredger")
	  setCanalDredgerOwner(connection.lastJsonMessage.seat)
	  if (connection.lastJsonMessage.owner) {
		setCanalDredger(true)
	  }
	}
  }, [connection.lastJsonMessage])




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
	  connection.sendJsonMessage({
		type: "Move Cards",
		cards: selectedCards,
		to: showMain ? ("side") : ("main"),
		from: showMain ? ("main") : ("side"),
		token: token
	  })
	}
	setSelectedCards([])
  }

  const selectCommander = (card) => {
	setSelectedCards([])
	setLastClicked(card)
	setSelectedCommanders([card])
  }


  const renderPickButtons = () => {
	if (canalDredgerOwner === -1 || canalDredger === true || pack.length > 1) {
	  return (
	  <>
	  <Button name="Pick to main" onClick={() => confirmPick("main")}/>
	  <Button name="Pick to side" onClick={() => confirmPick("side")}/>
	  </>)
	} else {
	  return (
		<>
		<Button name="Give" onClick={() => giveAway()}/>
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
		  onClickNavbar={()=>setShowDeckbuilder(!showDeckbuilder)}
		  buttonName={showDeckbuilder ? ("Show Draft") : ("Show Stats")}
		  left={onTheLeft}
		  right={onTheRight}
		  direction={direction}
		  username={username}/>
	  </>
	)
  }

  const confirmPick = (target) => {
	if (pick) {
	connection.sendJsonMessage({
	  type: "Pick",
	  card: pick,
	  zone: target,
	  token: token
	})
	setPick(0)
	setPack([])
	} else {
	  console.log("No card picked")
	  console.log(pack)
	}
  }

  const giveAway = () => {
	if (pick) {
	  connection.sendJsonMessage({
		type: "Give Last Card",
		card: pick,
		token: token,
		seat: canalDredgerOwner
	  })
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
                  <Image imageUrl={card.image_url} backsideUrl={card.backside_image_url}/>
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
  }} else {
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
			setCommanderColorIdentity={setCommanderColorIdentity}
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