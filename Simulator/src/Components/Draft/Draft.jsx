import { Button, Image, DraftNavbar, DraftStats } from "../";
import { useState, useEffect, createRef } from "react";
import './draft.css'


function filterCardsPos(cards, criteria) {
	var filtered = []
	for (let i = 1; i < criteria.length; i++) {
	  filtered = filtered.concat(cards.filter(card => card.types.includes(criteria[i])))
	  }
	return filtered
  }
  
  function filterCardsNeg(cards, criteria) {
	var filtered = [].concat(cards)
	for (let i = 1; i < criteria.length; i++) {
	  filtered = filtered.filter(card => !filtered.filter(card => card.types.includes(criteria[i])).includes(card))
	}
	return filtered
  }

export const Draft = ({setMode, connection, token, main, setMain, side, setSide, commanders, setCommanders, username }) => {
  const [pack, setPack] = useState([])
  const [pick, setPick] = useState(0)
  const [showMain, setShowMain] = useState(true)
  const [selectedCards, setSelectedCards] = useState([])
  const [selectedCommanders, setSelectedCommanders] = useState([])
  const [lastClicked, setLastClicked] = useState({})
  const [onTheLeft, setOnTheLeft] = useState("")
  const [onTheRight, setOnTheRight] = useState("")
  const [direction, setDirection] = useState(0)
  const [showDeckbuilder, setShowDeckbuilder] = useState(false)
  const [seatToken, setSeatToken] = useState("")
  const [cardsToDisplay, setCardsToDisplay] = useState([])
  const [typeFilter, setTypeFilter] = useState(["All"])
  const [canalDredger, setCanalDredger] = useState(false)
  const [canalDredgerOwner, setCanalDredgerOwner] = useState(-1)
  const [curveOfMain, setCurveOfMain] = useState([])
  const [curveOfDisplayed, setCurveOfDisplayed] = useState([])
  const [maxManaValue, setMaxManaValue] = useState(0)
  const [commanderColorIdentity, setCommanderColorIdentity] = useState(["C"])


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
	if (typeFilter[0] === "All") {
	  setCardsToDisplay(main.concat(side).concat(commanders))
	} else {
	  setCardsToDisplay(
		typeFilter[0] === "Pos" 
	  ? filterCardsPos(main.concat(side).concat(commanders), typeFilter)
	  : filterCardsNeg(main.concat(side).concat(commanders), typeFilter)
	)}
	const mainWithoutLands = main.filter(card => !card.types.includes("Land"))
	setCurveOfMain(Array.from({ length: maxManaValue + 1 }, (_, index) => mainWithoutLands.concat(commanders).filter(card => card.mana_value === index).length));
  }, [main, side, commanders, typeFilter])


  useEffect(() => {
	const cardsToDisplayWithoutLands = cardsToDisplay.filter(card => !card.types.includes("Land"))
	setCurveOfDisplayed(Array.from({ length: maxManaValue + 1 }, (_, index) => cardsToDisplayWithoutLands.filter(card => showMain ? (main.includes(card)) : (side.includes(card))).filter(card => card.mana_value === index).length))
	  }, [cardsToDisplay, showMain])


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
	console.log(cardsToDisplay)
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


  const appointCommander = () => {
	if (selectedCards.length === 0) {
	  alert("No card selected")
	} else if (commanders.length === 2) {
	  alert("You can have at most two commanders")
	} else if (selectedCards.length > 1) {
	  alert("You can only set one commander at a time")
	} else if (!selectedCards[0].types.includes("Legendary") || !selectedCards[0].types.includes("Creature")) {
	  alert("Only legendary creatures can be commanders")
	} else if (commanders.length === 1 && 
		((selectedCards[0].color_identity.length > 2 || commanders[0].color_identity.length > 2) ||
		selectedCards[0].types.includes("God") || commanders[0].types.includes("God") )){
	  alert("Our house rules apply partner-rule to non-gods with less than 3 colors in their color identity")
	} else {
	  connection.sendJsonMessage({
		type: "Set Commander",
		card: selectedCards[0].id,
		token: token
	  })
	}
	setSelectedCards([])
  }


  const removeCommander = () => {
	if (selectedCommanders.length === 1) {
	  const target = showMain ? ("main") : ("side")
	  connection.sendJsonMessage({
		type: "Remove Commander",
		card: selectedCommanders[0].id,
		zone: target,
		token: token
	  })
	} else {
	  alert("No commander selected")
	}
  }
 
  const switchView = () => {
	setShowMain(!showMain)
	setSelectedCards([])
  }


  const chooseCard = (card) => {
	setPick(card.id)
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

  const defaultImageUrl = "https://cards.scryfall.io/large/front/3/0/308ac133-f368-4f6c-9e09-d9cfc136355a.jpg?1605483061"

  const sideNav = () => {
	const headerRef = createRef()

	useEffect(() => {
		const adjustBodyPosition = () => {
		  // Force layout recalculation by accessing offsetHeight
		  const headerHeight = headerRef.current.clientHeight;
		  const screenHeight = window.innerHeight;
		  const bodyElement = document.querySelector('.sidenav-body');
		  bodyElement.style.top = `${headerHeight}px`;
		  bodyElement.style.height = `${screenHeight - headerHeight}px`;
		};
	  
	  
		// Call adjustBodyPosition initially and on window resize
		adjustBodyPosition();
		window.addEventListener('resize', adjustBodyPosition);
	  
		// Cleanup event listener on component unmount
		return () => {
		  window.removeEventListener('resize', adjustBodyPosition);
		};
	  }, [lastClicked, headerRef]);
	  


	return (
	  <div className="sidenav">
		<div className="sidenav-header" ref={headerRef}>
		<p>Draft: {token} {seatToken ? (`Seat: ${seatToken}`):("")}</p>
		{Object.keys(lastClicked).length === 0 ? (
  		  <Image imageUrl={defaultImageUrl} backsideUrl="" />
		) : (
  		  <Image imageUrl={lastClicked.image_url} backsideUrl={lastClicked.backside_image_url}/>
		)}
		<p>
		  <Button name={showMain ? ("Show Side") : ("Show Main")} onClick={() => switchView()}/>
		  <Button name={showMain ? ("Move to Side") : ("Move to Main")} onClick={() => moveCards()}/>
		</p>
		<p><Button 
		  name={selectedCommanders.length === 1 ? (showMain ? "Move Commander to Main" : "Move Commander to Side") : "Set Commander"}
		  onClick={selectedCommanders.length === 1 ? (() => removeCommander()) : (() => appointCommander())}/></p>
	    <div className="commander">
		  <span className="text">Commanders</span>
		  {commanderColorIdentity.map((color, index) => (
    		<span key={index} className="mana-symbol">
    		  <img src={`https://svgs.scryfall.io/card-symbols/${color}.svg`} alt="Mana Symbol" />
    		</span>
		  ))}
		</div>

		<ul className="ulcardlist">
		  {commanders.map((card, index) => (
			<li key={index} className={selectedCommanders.includes(card) ? ("clicked") : ("notClicked")} onClick={()=> selectCommander(card)}>{card.name}</li>
		  ))}
		</ul>
		<span className="text ">{showMain ? (`Main ${main.length} /${100-commanders.length}`) : ("Side")}</span>
		</div>
		<div className="sidenav-body">
		{showMain ? (
		  <ul className="ulcardlist">
			{main.map((card, index) => (
			  <li key={index} className={selectedCards.includes(card) ? ("clicked") : ("notClicked")} onClick={() => selectCards(card)}>{card.name}</li>
			))}
		  </ul>
		) : (
		  <ul className="ulcardlist">
			{side.map((card, index) => (
			  <li key={index} className={selectedCards.includes(card) ? ("clicked") : ("notClicked")} onClick={() => selectCards(card)}>{card.name}</li>
			))}
		  </ul>
		)}
	    </div>
	  </div>
	)
  }
  if (!showDeckbuilder) {
  if (pack) {
    return (
	  <>
	  {sideNav()}
	  <div className="main">
	    <DraftNavbar
		  onClickNavbar={()=>setShowDeckbuilder(!showDeckbuilder)}
		  buttonName={showDeckbuilder ? ("Show Draft") : ("Show Deckbuilder")}
		  left={onTheLeft}
		  right={onTheRight}
		  direction={direction}
		  username={username}/>
	    {pack ? (
		  <>
		  {renderPickButtons()}
        <table className="pack">
          <tbody>
            {pack.reduce((rows, card, index) => {
              if (index % 5 === 0) rows.push([]); // Start a new row every 5 cards
              rows[rows.length - 1].push(
                <td key={index} className={pick === card.id ? ("selected") : ("card")} onClick={() => chooseCard(card)}>
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
	    ) : (
		  <h2>Waiting for pack</h2>
	    )}
	  </div>
	  </>
    );
  } else {
	return (
	  <>
		{sideNav()}
	  <div className="main">
		<h1>Draft</h1>
		<h2>Waiting for pack</h2>
	  </div>
	  </>
	);
  }} else {
	return (
	  <>
		{sideNav()}
		<div className="main">
		  <DraftNavbar
			onClickNavbar={()=>setShowDeckbuilder(!showDeckbuilder)}
			buttonName={showDeckbuilder ? ("Show Draft") : ("Show Stats")}
			left={onTheLeft}
			right={onTheRight}
			direction={direction}
			username={username}/>
		  <DraftStats
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
			curveOfDisplayed={curveOfDisplayed}/>
		</div>
	  </>
	)
  }
}