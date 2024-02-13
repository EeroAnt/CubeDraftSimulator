import { PostDraftNavBar, DeckBuilder, SideBar } from "../";
import { useState, useEffect } from "react";
import './postdraft.css'

export function PostDraft({ 
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
	cardsToDisplay,
	setCardsToDisplay,
	typeFilter,
	setTypeFilter,
	colorFilterPos,
	colorFilterNeg,
	setColorFilterPos,
	setColorFilterNeg,
	admin
}) {
  

  const [deckToSubmit, setDeckToSubmit] = useState([])
  const [basicLands, setBasicLands] = useState([0,0,0,0,0,0])

  useEffect(() => {
	if (connection.lastJsonMessage && connection.lastJsonMessage.type === "Picked Cards") {
	  setMain(connection.lastJsonMessage.main)
	  setSide(connection.lastJsonMessage.side)
	  setCommanders(connection.lastJsonMessage.commanders)
	}
  }, [connection.lastJsonMessage])


  useEffect(() => {
	const csvData = [ ["Name", "Mana_value", "Draft pool"] ]
	csvData.push(["Commanders", "", ""])
	commanders.forEach((commander) => {
	  csvData.push([commander.name, commander.mana_value, commander.draft_pool])})
	csvData.push(["Main", "", ""])
	main.forEach((card) => {
	  csvData.push([card.name, card.mana_value, card.draft_pool])})
	csvData.push(["Basic Lands", "", ""])
	csvData.push(["Plains", "", basicLands[0]])
	csvData.push(["Island", "", basicLands[1]])
	csvData.push(["Swamp", "", basicLands[2]])
	csvData.push(["Mountain", "", basicLands[3]])
	csvData.push(["Forest", "", basicLands[4]])
	csvData.push(["Wastes", "", basicLands[5]])
	csvData.push(["", "", ""])
	csvData.push(["", "", ""])
	csvData.push(["Side", "", ""])
	side.forEach((card) => {
	  csvData.push([card.name, card.mana_value, card.draft_pool])})
	setDeckToSubmit(csvData)
	}, [main, side, commanders])
	
  const renderNavbar = () => {
	return <PostDraftNavBar 
		admin={admin} 
		connection={connection}
		token={token}
		deckToSubmit={deckToSubmit}
		username={username}
		basicLands={basicLands}
		setBasicLands={setBasicLands}
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


  const renderSideBar = () => {
	return <SideBar
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
		basicLands={basicLands}
		/>
  }


  const renderDecbuilder = () => {
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
	  setCommanderColorIdentity={setCommanderColorIdentity} 
	  showDeckbuilder={showDeckbuilder} 
	  colorFilterPos={colorFilterPos} 
	  colorFilterNeg={colorFilterNeg} 
	  setColorFilterPos={setColorFilterPos} 
	  setColorFilterNeg={setColorFilterNeg} 
	  />;
  };

  return <div className="draft">

	  {renderSideBar()}
	  <div className="main">
	  {renderNavbar()}
	  {renderDecbuilder()}
	  </div>
  </div>;
}