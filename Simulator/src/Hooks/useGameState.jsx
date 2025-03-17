import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useWebSocket from 'react-use-websocket'
import { decrypt, reconnect, sendMessage } from '../Services'

export const useGameState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState("Home")
  const [homeMode, setHomeMode] = useState(() => searchParams.get("h") || "Login");
  const [numberOfPlayers, setNumberOfPlayers] = useState(() => searchParams.get("n") || 1);
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
  const [draftInitiated, setDraftInitiated] = useState(false)

  useEffect(() => {
    if (mode === "Home") {
      setSearchParams({ u: username, d: token, a: admin, h: homeMode });
    } else if (mode === "Lobby") {
      setSearchParams({ u: username, d: token, n: numberOfPlayers, s: seatToken, o: owner, a: admin });
    } else if (mode === "Draft") {
      setSearchParams({ u: username, d: token, s: seatToken, o: owner, a: admin, cdo: canalDredgerOwner, cd: canalDredger });
    }
  }, [username, token, numberOfPlayers, seatToken, canalDredger, canalDredgerOwner, owner, admin, mode, homeMode]);

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
    homeMode, setHomeMode,
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
    draftInitiated, setDraftInitiated,
    connection
  };
}