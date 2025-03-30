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
  const [round, setRound] = useState("")
  const [wizardSelection, setWizardSelection] = useState(1)

  useEffect(() => {
    console.log("wizardSelection", wizardSelection)
    setWizardSelection(Math.floor(Math.random() * 3) + 1)
  }, [round])

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
      setSearchParams({ u: username, d: token, s: seatToken, o: owner, cdo: canalDredgerOwner, cd: canalDredger });
    } else if (mode === "Post Draft") {
      setSearchParams({ u: username, d: token, s: seatToken, o: owner });
    }
  }, [username, token, numberOfPlayers, playersInLobby, seatToken, canalDredger, canalDredgerOwner, owner, mode, homeMode]);

  useEffect(() => {
    if (decryptedMessage) {
      // console.log(decryptedMessage) // Uncomment this line to view messages, it messes up some rendering tho.
      if (mode === "Home") {
        if (homeMode === "Join") {
          if (decryptedMessage.drafts) {
            const filteredDrafts = decryptedMessage.drafts.filter(draft => draft !== null && draft.players > 0);
            setDrafts(filteredDrafts)
          }
        }
      }
      if (homeMode === "Create" || mode === "Waiting") {
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
      if (mode === "Lobby") {
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
      }
      if (mode === "Draft") {
        if (decryptedMessage.type === "Round") {
          setRound(decryptedMessage.round)
          } 
        if (decryptedMessage.type === "Seat token") {
          setSeatToken(decryptedMessage.seat)
        }
        if (decryptedMessage.type === "Pack") {

          setPack(decryptedMessage.pack)

        } else if (decryptedMessage.type === "End Draft") {

          setMode("DeckBuilder")

        } else if (decryptedMessage.type === "Picked Cards") {

          setMain(decryptedMessage.main)
          setSide(decryptedMessage.side)
          setCommanders(decryptedMessage.commanders)

        } else if (decryptedMessage.type === "Canal Dredger") {
          
          setCanalDredgerOwner(decryptedMessage.owner)
          setCanalDredger("T")

        } else if (decryptedMessage.type === "Post Draft") {

          setMode("Post Draft")

        } else if (decryptedMessage.type === "Queues") {
          if (JSON.stringify(decryptedMessage.queues) !== JSON.stringify(queues)) {
            setQueues(decryptedMessage.queues)
          }
        }
      }
      if (mode === "Post Draft") {
        if (decryptedMessage.type === "Picked Cards") {
          setMain(decryptedMessage.main)
          setSide(decryptedMessage.side)
          setCommanders(decryptedMessage.commanders)
        }
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
      messageQueue.push(parsed);  // Add incoming messages to the queue
      if (!isProcessing) {
        processQueue();
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
    connection
  };
}