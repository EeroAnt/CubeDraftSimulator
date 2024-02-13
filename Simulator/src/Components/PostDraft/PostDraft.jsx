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