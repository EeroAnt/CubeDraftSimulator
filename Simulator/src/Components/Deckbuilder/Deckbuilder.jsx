import { Button, SideBar } from '../'
import { useEffect } from 'react'

export const DeckBuilder = ({
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
	setTypeFilter
}) => {
  
  return (
	<div className="main">
	  <h1>We made it!</h1>
	  <Button name="Go Back" onClick={() => console.log("stuff")}/>
	</div>
  )
}