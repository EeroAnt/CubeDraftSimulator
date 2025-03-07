import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { Home, Draft, Lobby, PostDraft } from '../'
import 'bootstrap/dist/css/bootstrap.min.css'
import useWebSocket from 'react-use-websocket'
import { decrypt, reconnect, sendMessage } from '../../Services'

export const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState("Home")
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const [username, setUsername] = useState(() => searchParams.get("user") || "");
  const [owner, setOwner] = useState(false)
  const [token, setToken] = useState(() => searchParams.get("draft") || "");
  const [main, setMain] = useState([])
  const [side, setSide] = useState([])
  const [commanders, setCommanders] = useState([])
  const [seatToken, setSeatToken] = useState(() => searchParams.get("seat") || "");
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
  const [decryptedMessage, setDecryptedMessage] = useState("")

  useEffect(() => {
    setSearchParams({ user: username, draft: token, seat: seatToken });
  }, [username, token, seatToken]);

  useEffect(() => {
    if (decryptedMessage.type === "Seat token") {
      setSeatToken(decryptedMessage.seat)
    }
  }, [decryptedMessage])

  const connection = useWebSocket(import.meta.env.VITE_REACT_APP_WS_URL,{
  share: true,
  onOpen: async () => {
    console.log('opened')
    const { message, newMode } = await reconnect(username, token, seatToken)
    sendMessage(connection, message)
    if (mode !== newMode) {
      setMode(newMode)
    }
  },
  onClose: () => console.log('closed'),
  onError: (e) => console.log('error', e),
  onMessage: (e) => {
    const decrypted = decrypt(e.data)
    const parsed = JSON.parse(decrypted)
    setTimeout(() => {
      setDecryptedMessage(parsed);
    }, 0);
    }
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
        decryptedMessage={decryptedMessage}
      />
    )}


    {mode === "Lobby" && (
      <Lobby 
        setMode={setMode}
        connection={connection}
        numberOfPlayers={numberOfPlayers}
        owner={owner}
        token={token}
        decryptedMessage={decryptedMessage}
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
        seatToken={seatToken}
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
        decryptedMessage={decryptedMessage}
      />
    )}
    
    {mode === "Post Draft" && (
      <PostDraft
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
        decryptedMessage={decryptedMessage}
      />
    )}
  </div>
  )
}