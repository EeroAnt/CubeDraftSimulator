import { useState, useEffect } from 'react'
import Form from './Components/Form.jsx'
import Buttons from './Components/Buttons.jsx'
import Packs from './Services/Packs.jsx'
import Image from './Components/Image.jsx'
import './App.css'


function App() {
  const [playersPacks, setPlayersPacks] = useState([])
  const [playersCards, setPlayersCards] = useState([])
  const [chosenCard, setChosenCard] = useState("")

  const initDraft = (event) => {
	event.preventDefault()
	Packs.getAll()
	.then(response => {
	  console.log(response.data)
	  setPlayersPacks(response.data)
	})
	.then(() => {
	  setPlayersCards(playersPacks[0][2])
  })
  }

  return (
    <>
	  <h1>Simulator</h1>
	  <Form.Form name="test" onChange={() => console.log('so it begins')}/>
	  <Buttons.Button name="init draft" onClick={initDraft}/>
	  <tr>
		{playersCards.map(
		  card => <td key={card.id} className={chosenCard === card.id ? "Selected" : "table-cell" }>
		    <Image imageUrl={card.image_url} backsideUrl={card.backside_image_url} />
		    <Form.Radio name={card.name} id={card.id} onChange={() => setChosenCard(card.id)}/>
		</td>)}
	  </tr>
	</>
  )
}

export default App
