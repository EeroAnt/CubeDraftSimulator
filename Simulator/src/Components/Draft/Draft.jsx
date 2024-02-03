import { Button, Image, DraftNavbar, DraftStats } from "../";
import { useState, useEffect, createRef } from "react";
import './draft.css'


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
  const [showStats, setShowStats] = useState(false)
  const [seatToken, setSeatToken] = useState("")


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
		card: selectedCards[0],
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
		card: selectedCommanders[0],
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
  		  <p>Click a card in your main or side</p>
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
	    <h3>Commanders</h3>
		<ul >
		  {commanders.map((card, index) => (
			<li key={index} className={selectedCommanders.includes(card) ? ("clicked") : ("notClicked")} onClick={()=> selectCommander(card)}>{card.name}</li>
		  ))}
		</ul>
		<h3>{showMain ? (`Main ${main.length} /${100-commanders.length}`) : ("Side")}</h3>
		</div>
		<div className="sidenav-body">
		{showMain ? (
		  <ul >
			{main.map((card, index) => (
			  <li key={index} className={selectedCards.includes(card) ? ("clicked") : ("notClicked")} onClick={() => selectCards(card)}>{card.name}</li>
			))}
		  </ul>
		) : (
		  <ul>
			{side.map((card, index) => (
			  <li key={index} className={selectedCards.includes(card) ? ("clicked") : ("notClicked")} onClick={() => selectCards(card)}>{card.name}</li>
			))}
		  </ul>
		)}
	    </div>
	  </div>
	)
  }
  if (!showStats) {
  if (pack) {
    return (
	  <>
	  {sideNav()}
	  <div className="main">
	    <DraftNavbar
		  onClickNavbar={()=>setShowStats(!showStats)}
		  buttonName={showStats ? ("Show Draft") : ("Show Stats")}
		  left={onTheLeft}
		  right={onTheRight}
		  direction={direction}
		  username={username}/>
	    {pack ? (
		  <>
		  <Button name="Pick to main" onClick={() => confirmPick("main")}/>
		  <Button name="Pick to side" onClick={() => confirmPick("side")}/>
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
			onClickNavbar={()=>setShowStats(!showStats)}
			buttonName={showStats ? ("Show Draft") : ("Show Stats")}
			left={onTheLeft}
			right={onTheRight}
			direction={direction}
			username={username}/>
		  <h1>Here be Stats</h1>
		  <DraftStats
			main={main}
			side={side}
			commanders={commanders}
			showMain={showMain}
			selectedCards={selectedCards}
			selectCards={selectCards}/>
		</div>
	  </>
	)
  }
}