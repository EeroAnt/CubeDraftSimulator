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
  const [mainColorIdentity, setMainColorIdentity] = useState(["C"])
  const [showDeckbuilder, setShowDeckbuilder] = useState(false)
  const [cardsToDisplay, setCardsToDisplay] = useState([])
  const [typeFilter, setTypeFilter] = useState(["All"])
  const [colorFilterPos, setColorFilterPos] = useState([])
  const [colorFilterNeg, setColorFilterNeg] = useState([])
  const [decryptedMessage, setDecryptedMessage] = useState("")
  const [canalDredgerOwner, setCanalDredgerOwner] = useState(() => searchParams.get("cdo") || "");
  const [canalDredger, setCanalDredger] = useState(() => searchParams.get("cd") || "F");
  const [draftInitiated, setDraftInitiated] = useState(false)
  const [playersInLobby, setPlayersInLobby] = useState(() => searchParams.get("p") || 0)
  const [drafts, setDrafts] = useState([])
  const [lobbyMode, setLobbyMode] = useState("")
  const [playerList, setPlayerList] = useState([])
  const [queues, setQueues] = useState([])
  const [pack, setPack] = useState([])
  const [round, setRound] = useState(() => searchParams.get("r") || 0)
  const [wizardSelection, setWizardSelection] = useState(1)
  // const [lastAcked, setLastAcked] = useState("")

  useEffect(() => {
    setWizardSelection(Math.floor(Math.random() * 3) + 1)
  }, [round])

  useEffect(() => {
    setWizardSelection(Math.floor(Math.random() * 3) + 1)
  }, [])

  const arraysEqualById = (a, b) =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, i) => val.id === b[i].id);

  useEffect(() => {
    if (commanders.length === 0) {
      setCommanderColorIdentity(["C"])
    } else if (commanders.length === 1) {
      setCommanderColorIdentity(commanders[0].color_identity.split(""))
    } else {
      const combined = commanders[0].color_identity.split("").concat(commanders[1].color_identity.split(""))
      const unique = [...new Set(combined)]
      unique.length < 2 ? setCommanderColorIdentity(unique) : setCommanderColorIdentity(unique.filter(color => color !== "C"))
    }
  }, [commanders])

  useEffect(() => {
    if (main.length === 0) {
      setMainColorIdentity(["C"])
    } else if (main.length === 1) {
      setMainColorIdentity(main[0].color_identity.split(""))
    } else {
      const combined = main.map(card => card.color_identity.split("")).flat()
      const unique = [...new Set(combined)]
      unique.length < 2 ? setMainColorIdentity(unique) : setMainColorIdentity(unique.filter(color => color !== "C"))
    }
  }, [main])

  useEffect(() => {
    if (mode === "Home") {
      setSearchParams({ u: username, d: token, h: homeMode });
    } else if (mode === "Lobby") {
      setSearchParams({ u: username, d: token, n: numberOfPlayers, p: playersInLobby, s: seatToken, o: owner });
    } else if (mode === "Draft") {
      setSearchParams({ u: username, d: token, s: seatToken, r: round, o: owner, cdo: canalDredgerOwner, cd: canalDredger });
    } else if (mode === "Post Draft") {
      setSearchParams({ u: username, d: token, s: seatToken, o: owner });
    }
  }, [username, token, numberOfPlayers, playersInLobby, seatToken, canalDredger, canalDredgerOwner, owner, mode, homeMode]);

  useEffect(() => {
    if (!decryptedMessage) return;
    console.log("message received", decryptedMessage)
    if (decryptedMessage.ackToken) {
      const message = {
        type: "Ack",
        ackToken: decryptedMessage.ackToken,
      }
      sendMessage(connection, message)
    }
    if (decryptedMessage.status === "No Draft") {
      alert("No draft found")
      setMode("Home")
      return
    }
    if (decryptedMessage.type === "Deckbuilding") {
      setMode("Post Draft")
    }
    switch (mode) {
      case "Home":
        if (homeMode === "Join") {
          if (decryptedMessage.drafts) {
            const filteredDrafts = decryptedMessage.drafts.filter(draft => draft !== null && draft.players > 0);
            setDrafts(filteredDrafts)
          }
        }
        if (homeMode === "Create") {
          if (decryptedMessage.status === "OK" && decryptedMessage.type === "Playerlist") {
            setMode("Lobby")
          }
          if (decryptedMessage.status === "Setup OK") {
            setMode("Lobby")
          } else if (decryptedMessage.status === "Setup Failed") {
            console.log(decryptedMessage.errors)
            alert("Setup failed")
            setDraftInitiated(false)
          }
        }
        break;
      case "Waiting":
        if (decryptedMessage.status === "OK" && decryptedMessage.type === "Playerlist") {
          setMode("Lobby")
        }
        if (decryptedMessage.status === "Setup OK") {
          setMode("Lobby")
        } else if (decryptedMessage.status === "Setup Failed") {
          console.log(decryptedMessage.errors)
          alert("Setup failed")
          setDraftInitiated(false)
        }
        break;
      case "Lobby":
        if (decryptedMessage.players) {
          const numPlayers = Object.keys(decryptedMessage.players).length;
          setPlayersInLobby(numPlayers)
          setPlayerList(decryptedMessage.players)
          if (lobbyMode !== "LobbySuccess") {
            setLobbyMode("LobbySuccess")
          }
        } else if (decryptedMessage.status === "OK" && decryptedMessage.type === "Start Draft") {
          setMode("Draft")
        } else if (decryptedMessage.status === "Draft Already Started") {
          setLobbyMode("DraftStarted")
        } else if (decryptedMessage.status === "Lobby Full") {
          setLobbyMode("LobbyFull")
        } else if (decryptedMessage.status != "OK") {
          setLobbyMode("LobbyFailed")
        }
        break;
      case "Draft":
        if (decryptedMessage.status === "OK" && decryptedMessage.type === "DraftState") {
          setQueues(decryptedMessage.queues)
          if (decryptedMessage.state) {
            const payload = decryptedMessage.state
            setSeatToken(payload.seat)
            if (!arraysEqualById(payload.main, main)) {
              setMain(payload.main)
            }
            if (!arraysEqualById(payload.commanders, commanders)) {
              setCommanders(payload.commanders)
            }
            if (!arraysEqualById(payload.side, side)) {
              setSide(payload.side)
            }
            setPack(payload.packAtHand)
            setRound(payload.round)
            if (payload.canalDredger !== "false") {
              setCanalDredgerOwner(payload.canalDredgerOwner)
              setCanalDredger("T")
            }
          }
        } else if (decryptedMessage.type === "End Draft") {

          setMode("DeckBuilder")

        } else if (decryptedMessage.type === "Post Draft") {

          setMode("Post Draft")

        }
        break;
      case "DeckBuilder":
        if (decryptedMessage.type === "Picked Cards") {
          setMain(decryptedMessage.main)
          setSide(decryptedMessage.side)
          setCommanders(decryptedMessage.commanders)
        }
        break;
      case "Post Draft":
        if (decryptedMessage.type === "Picked Cards") {
          setMain(decryptedMessage.main)
          setSide(decryptedMessage.side)
          setCommanders(decryptedMessage.commanders)
        }
    }
  }, [decryptedMessage])

  const messageQueue = [];
  const [isProcessing, setIsProcessing] = useState(false);

  const processQueue = () => {
    if (messageQueue.length === 0) {
      setIsProcessing(false);
      return;
    }
    setIsProcessing(true);
    const nextMessage = messageQueue.shift();
    setDecryptedMessage(nextMessage);
    setTimeout(() => {
      processQueue();
    }, 0);
  };

  function sanitizeJsonString(str) {
    // Replace all non-printable control characters except \n, \t
    return str.replace(/[^\u0020-\u007E\r\n\t]/g, ' ');
  }

  function deepSanitizeStrings(obj) {
    if (typeof obj === 'string') {
      return sanitizeJsonString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(deepSanitizeStrings);
    } else if (obj && typeof obj === 'object') {
      const result = {};
      for (const key in obj) {
        result[key] = deepSanitizeStrings(obj[key]);
      }
      return result;
    }
    return obj;
  }
  const connection = useWebSocket(import.meta.env.VITE_REACT_APP_WS_URL, {
    share: true,
    onOpen: async () => {
      console.log("Connecting to:", import.meta.env.VITE_REACT_APP_WS_URL);
      const { message, newMode } = await reconnect(username, token, seatToken, setUsername, setToken, setSeatToken)
      sendMessage(connection, message)
      if (mode !== newMode) {
        setMode(newMode)
      }
    },
    onClose: () => console.log('closed'),
    onError: (e) => console.log('error', e),
    onMessage: (e) => {
      const key = import.meta.env.VITE_MY_ENCRYPTION;
      const { message } = JSON.parse(e.data);
      const decrypted = decrypt(message, key);
      const sanitizedDecrypted = sanitizeJsonString(decrypted);
      try {
        const parsed = JSON.parse(sanitizedDecrypted);
        const cleanParsed = deepSanitizeStrings(parsed);
        messageQueue.push(cleanParsed);
        if (!isProcessing) {
          processQueue();
        }
      } catch (err) {
        console.error("‼️ JSON parse failed:", err.message);
        for (let i = 0; i < decrypted.length; i++) {
          const code = decrypted.charCodeAt(i);
          if (code < 32 || code === 127) {
            console.warn(`Control char at ${i}: \\u${code.toString(16).padStart(4, '0')}`);
          }
        }
        console.log("Decrypted string:", decrypted);
      }
    }
  })

  return {
    mode, setMode,
    homeMode, setHomeMode,
    numberOfPlayers, setNumberOfPlayers,
    username, setUsername,
    owner, setOwner,
    token, setToken,
    main,
    side,
    commanders,
    seatToken,
    round,
    showMain, setShowMain,
    selectedCards, setSelectedCards,
    selectedCommanders, setSelectedCommanders,
    lastClicked, setLastClicked,
    curveOfMain, setCurveOfMain,
    curveOfDisplayed, setCurveOfDisplayed,
    maxManaValue, setMaxManaValue,
    commanderColorIdentity,
    mainColorIdentity,
    showDeckbuilder, setShowDeckbuilder,
    cardsToDisplay, setCardsToDisplay,
    typeFilter, setTypeFilter,
    colorFilterPos, setColorFilterPos,
    colorFilterNeg, setColorFilterNeg,
    canalDredgerOwner, setCanalDredgerOwner,
    canalDredger, setCanalDredger,
    draftInitiated, setDraftInitiated,
    playersInLobby, setPlayersInLobby,
    drafts,
    lobbyMode,
    playerList,
    queues,
    pack, setPack,
    connection,
    wizardSelection
  };
}