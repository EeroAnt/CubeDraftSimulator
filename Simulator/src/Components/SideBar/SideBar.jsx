import { useEffect, createRef } from "react";
import { Image, Button, ManaSymbol } from "../";

export const SideBar = ({
	lastClicked, 
	token, 
	seatToken,
	showMain,
	selectedCommanders,
	commanderColorIdentity,
	commanders,
	main,
	side,
	selectedCards,
	selectCards,
	selectCommander,
	moveCards,
	setShowMain,
	setSelectedCards,
	connection,
	basicLands
	}) => {
  const headerRef = createRef()


  const switchView = () => {
	setShowMain(!showMain)
	setSelectedCards([])
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


  const defaultImageUrl = "https://cards.scryfall.io/large/front/3/0/308ac133-f368-4f6c-9e09-d9cfc136355a.jpg?1605483061"


  useEffect(() => {
	const adjustBodyPosition = () => {
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
    		  <ManaSymbol symbol={color}/>
    		</span>
		  ))}
		</div>

		<ul className="ulcardlist">
		  {commanders.map((card, index) => (
			<li key={index} className={selectedCommanders.includes(card) ? ("clicked") : ("notClicked")} onClick={()=> selectCommander(card)}>{card.name}</li>
		  ))}
		</ul>
		<span className="text ">{showMain ? (`Main ${basicLands ? main.length+basicLands.reduce((accumulator, currentValue) => accumulator + currentValue, 0) : main.length} /${100-commanders.length}`) : ("Side")}</span>
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