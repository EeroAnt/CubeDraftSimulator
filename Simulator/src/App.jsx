import { useState, useEffect } from 'react'
import Form from './Components/Forms.jsx'
import Buttons from './Components/Buttons.jsx'
import Packs from './Services/Packs.jsx'
import Image from './Components/Image.jsx'
import './App.css'


function App() {
  const [data, setData] = useState(null)
  const [mode, setMode] = useState(0)
  const [numberOfPlayers, setNumberOfPlayers] = useState(4)
  const [draftSetup, setDraftSetup] = useState(false)
  const [packs, setPacks] = useState([])
  const [draftOnline, setDraftOnline] = useState(false)
  const [packsInRound, setPacksInRound] = useState([])
  const [cardsAtHand, setCardsAtHand] = useState([])
  const [playerNumber, setPlayerNumber] = useState(0)
  const [chosenCard, setChosenCard] = useState("") 
  const [mainDeck, setMainDeck] = useState([])
  const [pickNumber, setPickNumber] = useState(0)
  const [cardPicked, setCardPicked] = useState(false)
  const [roundNumber, setRoundNumber] = useState(0)
  const [playerQueue, setPlayerQueue] = useState([])
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  const changePlayerNumber = (event) => {
	event.preventDefault()
	setNumberOfPlayers(event.target.value)
  }

  const setupDraft = (event) => {
	event.preventDefault()
	console.log(data)
	setMode(1)
	setDraftSetup(true)
	// setPlayerQueue(new Array(numberOfPlayers).fill([]))
	// setPlayers(new Array(numberOfPlayers-1).fill().concat({PlayerObject(name="human", ishuman=true, id=0)}))
	Packs.getAll()
	.then(response=> {
	  setPacks(response.data)
	})
  }

  const cancelSetup = (event) => {
	event.preventDefault()
	setMode(0)
	setNumberOfPlayers(4)
  }

  const initDraft = (event) => {
	event.preventDefault()
	setMode(2)
	setPacksInRound(packs[roundNumber])
	setCardsAtHand(packs[roundNumber][playerNumber])
  }

  const pickCard = (event) => {
	event.preventDefault()
	if (chosenCard === "") {
	  return
	}
	else {
	const card = cardsAtHand.find(card => card.id === chosenCard)
	let newPacks = packsInRound
	newPacks[(playerNumber+pickNumber)%numberOfPlayers] = packsInRound[(playerNumber+pickNumber)%numberOfPlayers].filter(card => card.id !== chosenCard)
	setPacksInRound(newPacks)
	setMainDeck(mainDeck.concat(card))
	setPickNumber(pickNumber + 1)
	setChosenCard("")
	setCardPicked(true)
	}
  }

  const nextPack = (event) => {
	event.preventDefault()
	setCardsAtHand(packsInRound[(playerNumber + pickNumber) % numberOfPlayers])
	console.log(mainDeck)
	setCardPicked(false)
	  }


  if (mode === 0) {
  return (
    <>
	  <h1>Simulator</h1>
	  <Form.Dropdown name="number of players" handleChange={changePlayerNumber}/>
	  <Buttons.Button name="init draft" onClick={setupDraft}/>
	</>
  )
  }
  else if (mode === 1){
	return (
	  <>
	    <h1>Simulator</h1>
		<h3>Number of players = {numberOfPlayers}</h3>
		<Buttons.Button name="start draft" onClick={initDraft}/>
		<Buttons.Button name="cancel" onClick={cancelSetup}/>
	  </>
	)
  }
  else {
	return (  
	<>{cardPicked ? "" :
	  <tr>
		{cardsAtHand.map(
		  card => <td key={card.id}
		    className={chosenCard === card.id ? "Selected" : "table-cell" }
			onClick={() => (setChosenCard(card.id))}>
		      <Image imageUrl={card.image_url} backsideUrl={card.backside_image_url} />
		</td>)}
	  </tr>}
	  <Buttons.Button name={cardPicked ? "Next pack" : "Confirm pick"} onClick={cardPicked ? nextPack :pickCard }/>
	</>
  )
}
}


export default App
