import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useWebSocket from 'react-use-websocket'
import { decrypt, reconnect, sendMessage } from '../Services'

export const useGameState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState("Home")
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const [username, setUsername] = useState(() => searchParams.get("u") || "");
  const [owner, setOwner] = useState(() => searchParams.get("o") || "F");
  const [token, setToken] = useState(() => searchParams.get("d") || "");
  const [main, setMain] = useState([])
  const [side, setSide] = useState([])
  const [commanders, setCommanders] = useState([])
  const [seatToken, setSeatToken] = useState(() => searchParams.get("s") || "");
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
  const [admin, setAdmin] = useState(() => searchParams.get("a") || "F");
  const [decryptedMessage, setDecryptedMessage] = useState("")
  const [canalDredgerOwner, setCanalDredgerOwner] = useState(() => searchParams.get("cdo") || "");
  const [canalDredger, setCanalDredger] = useState(() => searchParams.get("cd") || "F");

  useEffect(() => {
    setSearchParams({ u: username, d: token, s: seatToken, cd: canalDredger, cdo: canalDredgerOwner, o: owner , a: admin });
  }, [username, token, seatToken, canalDredger, canalDredgerOwner, owner, admin]);

  useEffect(() => {
    if (decryptedMessage.type === "Seat token") {
      setSeatToken(decryptedMessage.seat)
    }
  }, [decryptedMessage])

  const connection = useWebSocket(import.meta.env.VITE_REACT_APP_WS_URL, {
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

  return {
    mode, setMode,
    numberOfPlayers, setNumberOfPlayers,
    username, setUsername,
    owner, setOwner,
    token, setToken,
    main, setMain,
    side, setSide,
    commanders, setCommanders,
    seatToken, setSeatToken,
    showMain, setShowMain,
    selectedCards, setSelectedCards,
    selectedCommanders, setSelectedCommanders,
    lastClicked, setLastClicked,
    curveOfMain, setCurveOfMain,
    curveOfDisplayed, setCurveOfDisplayed,
    maxManaValue, setMaxManaValue,
    commanderColorIdentity, setCommanderColorIdentity,
    showDeckbuilder, setShowDeckbuilder,
    cardsToDisplay, setCardsToDisplay,
    typeFilter, setTypeFilter,
    colorFilterPos, setColorFilterPos,
    colorFilterNeg, setColorFilterNeg,
    admin, setAdmin,
    decryptedMessage,
    canalDredgerOwner, setCanalDredgerOwner,
    canalDredger, setCanalDredger,
    connection
  };
}