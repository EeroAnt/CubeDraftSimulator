import { useState } from 'react'
import styles from './App.module.css'
import { Home, Stats, Draft, Lobby, PostDraft } from '../'
import 'bootstrap/dist/css/bootstrap.min.css'
import useWebSocket from 'react-use-websocket'

export const App = () => {
  const [mode, setMode] = useState("Home")
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const [username, setUsername] = useState("")
  const [owner, setOwner] = useState(false)
  const [token, setToken] = useState("")
  const [main, setMain] = useState([])
  const [side, setSide] = useState([])
  const [commanders, setCommanders] = useState([])
  const [seatToken, setSeatToken] = useState("")
  const [showMain, setShowMain] = useState(true)
  const [selectedCards, setSelectedCards] = useState([])
  const [selectedCommanders, setSelectedCommanders] = useState([])
  const [lastClicked, setLastClicked] = useState({})
  const [curveOfMain, setCurveOfMain] = useState([])
  const [curveOfDisplayed, setCurveOfDisplayed] = useState([])
  const [maxManaValue, setMaxManaValue] = useState(0)
  const [commanderColorIdentity, setCommanderColorIdentity] = useState(["C"])
  const [showDeckbuilder, setShowDeckbuilder] = useState(false)
  const [cardsToDisplay, setCardsToDisplay] = useState([])
  const [typeFilter, setTypeFilter] = useState(["All"])
  const [colorFilterPos, setColorFilterPos] = useState([])
  const [colorFilterNeg, setColorFilterNeg] = useState([])
  const [admin, setAdmin] = useState(false)


//   ws://localhost:3001
//   ws://eeroncubesimu.northeurope.azurecontainer.io:3001
  const WS_URL = 'ws://localhost:3001'
  const connection = useWebSocket(WS_URL,{
  share: true,
  onOpen: () => console.log('opened'),
  onClose: () => console.log('closed'),
  onError: (e) => console.log('error', e),
  onMessage: (e) => console.log('message', e)
  })

  return (
	<div className={styles.App}>
	  
	  {mode === "Home" && (
	    <Home 
		  setMode={setMode}
		  setNumberOfPlayers={setNumberOfPlayers}
		  numberOfPlayers={numberOfPlayers}
		  username={username}
		  setUsername={setUsername}
		  connection={connection}
		  setOwner={setOwner}
		  setToken={setToken}
		  setAdmin={setAdmin}
		  />
	  )}

	  
	  {mode === "Lobby" && (
		<Lobby 
		  setMode={setMode}
		  connection={connection}
		  numberOfPlayers={numberOfPlayers}
		  owner={owner}
		  token={token}
		   />
	  )}

	  {mode === "Draft" && (
	    <Draft
		  setMode={setMode} 
		  connection={connection}
		  token={token}
		  main={main}
		  setMain={setMain}
		  side={side}
		  setSide={setSide}
		  commanders={commanders}
		  setCommanders={setCommanders}
		  username={username}
		  seatToken={seatToken}
		  setSeatToken={setSeatToken}
		  showMain={showMain}
		  setShowMain={setShowMain}
		  selectedCards={selectedCards}
		  setSelectedCards={setSelectedCards}
		  selectedCommanders={selectedCommanders}
		  setSelectedCommanders={setSelectedCommanders}
		  lastClicked={lastClicked}
		  setLastClicked={setLastClicked}
		  curveOfMain={curveOfMain}
		  setCurveOfMain={setCurveOfMain}
		  curveOfDisplayed={curveOfDisplayed}
		  setCurveOfDisplayed={setCurveOfDisplayed}
		  maxManaValue={maxManaValue}
		  setMaxManaValue={setMaxManaValue}
		  commanderColorIdentity={commanderColorIdentity}
		  setCommanderColorIdentity={setCommanderColorIdentity}
		  showDeckbuilder={showDeckbuilder}
		  setShowDeckbuilder={setShowDeckbuilder}
		  cardsToDisplay={cardsToDisplay}
		  setCardsToDisplay={setCardsToDisplay}
		  typeFilter={typeFilter}
		  setTypeFilter={setTypeFilter}
		  colorFilterPos={colorFilterPos}
		  colorFilterNeg={colorFilterNeg}
		  setColorFilterPos={setColorFilterPos}
		  setColorFilterNeg={setColorFilterNeg}

		  />
	  )}
	  
	  {mode === "Post Draft" && (
	    <PostDraft
		  setMode={setMode}
		  connection={connection}
		  token={token}
		  main={main}
		  setMain={setMain}
		  side={side}
		  setSide={setSide}
		  commanders={commanders}
		  setCommanders={setCommanders}
		  username={username}
		  seatToken={seatToken}
		  setSeatToken={setSeatToken}
		  showMain={showMain}
		  setShowMain={setShowMain}
		  selectedCards={selectedCards}
		  setSelectedCards={setSelectedCards}
		  selectedCommanders={selectedCommanders}
		  setSelectedCommanders={setSelectedCommanders}
		  lastClicked={lastClicked}
		  setLastClicked={setLastClicked}
		  curveOfMain={curveOfMain}
		  setCurveOfMain={setCurveOfMain}
		  curveOfDisplayed={curveOfDisplayed}
		  setCurveOfDisplayed={setCurveOfDisplayed}
		  maxManaValue={maxManaValue}
		  setMaxManaValue={setMaxManaValue}
		  commanderColorIdentity={commanderColorIdentity}
		  setCommanderColorIdentity={setCommanderColorIdentity}
		  showDeckbuilder={showDeckbuilder}
		  setShowDeckbuilder={setShowDeckbuilder}
		  cardsToDisplay={cardsToDisplay}
		  setCardsToDisplay={setCardsToDisplay}
		  typeFilter={typeFilter}
		  setTypeFilter={setTypeFilter}
		  colorFilterPos={colorFilterPos}
		  colorFilterNeg={colorFilterNeg}
		  setColorFilterPos={setColorFilterPos}
		  setColorFilterNeg={setColorFilterNeg}
		  admin={admin}
		  />
	  )}
	  
	  {mode === "Stats" && (
		<Stats 
		  setMode={setMode} />
	)}
	</div>
  )
}