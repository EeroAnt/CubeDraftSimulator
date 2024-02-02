import { useState } from 'react'
import styles from './App.module.css'
import { Home, Stats, Draft, Lobby } from '../'
import 'bootstrap/dist/css/bootstrap.min.css'
import useWebSocket from 'react-use-websocket'

export const App = () => {
  const [mode, setMode] = useState("Home")
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const [username, setUsername] = useState("")
  const [owner, setOwner] = useState(false)
  

  const WS_URL = 'ws://127.0.0.1:3001'
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
		  setOwner={setOwner} />
	  )}

	  
	  {mode === "Lobby" && (
		<Lobby 
		  setMode={setMode}
		  connection={connection}
		  numberOfPlayers={numberOfPlayers}
		  owner={owner}
		   />
	  )}

	  {mode === "Draft" && (
	    <Draft
		  setMode={setMode} 
		  connection={connection}/>
	  )}
	  
	  {mode === "DeckBuilder" && (
	    <DeckBuilder
		  setMode={setMode} />
	  )}
	  
	  {mode === "Stats" && (
		<Stats 
		  setMode={setMode} />
	)}
	</div>
  )
}