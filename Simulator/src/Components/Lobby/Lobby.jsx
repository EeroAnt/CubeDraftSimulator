import { Button, Form } from '../'
import { useState } from 'react'
import { useEffect } from 'react'


const renderPlayers = message => {
  console.log(Object.keys(message.players))
  return (
	  <ul>
		{Object.keys(message.players).map(uuid => {
		  return <li key={uuid}>{message.players[uuid]}</li>
			})}
	  </ul>
	)
  }



export const Lobby = ({setMode, connection, numberOfPlayers, owner, token}) => {
  
  const [playersInLobby, setPlayersInLobby] = useState(0)

  const startDraft = () => {
	connection.sendJsonMessage({
	  type: "Start Draft",
	  token: token
	})
  }

  const reJoinDraft = (seat) => {
	connection.sendJsonMessage({
	  type: "Rejoin Draft",
	  table: token,
	  seat: seat
	})
	console.log("Rejoining draft")
  }

  useEffect(() => {
    if (connection.lastJsonMessage && connection.lastJsonMessage.players) {
      const numPlayers = Object.keys(connection.lastJsonMessage.players).length;
      setPlayersInLobby(numPlayers)
    } else if (connection.lastJsonMessage && connection.lastJsonMessage.status === "OK") {
	  setMode("Draft")
	} else if (connection.lastJsonMessage && connection.lastJsonMessage.status === "Draft Already Started") {
	  console.log(connection.lastJsonMessage.status)
	} else if (connection.lastJsonMessage && connection.lastJsonMessage.status != "OK") {
	  console.log(connection.lastJsonMessage.status)
	}
  }, [connection.lastJsonMessage, numberOfPlayers])


  if (connection.lastJsonMessage && connection.lastJsonMessage.status === "OK" && connection.lastJsonMessage.type === "Playerlist") {
	console.log(connection.lastJsonMessage)
	return (
	  <div className="main">
		<h1>Lobby</h1>
		{owner ? (
		  <><h2>Draft Token: {token}</h2>
		    {playersInLobby === numberOfPlayers ? (
              <>
			  <h2>Everyone's here</h2><h2>Players:</h2>
			  {renderPlayers(connection.lastJsonMessage)}
			  <Button name="Start Draft" onClick={startDraft} />
              </>
			) : (
			  <>
              <h3>Waiting for all players to join</h3>
			  <h2>Playercount: </h2>
			  <p>{playersInLobby} / {numberOfPlayers}</p>
			  <h2>Players present:</h2>
			  {renderPlayers(connection.lastJsonMessage)}
			  </>
            )}
		  </>
		) : (
		  <>
		    <h2>Players present:</h2>
			  {renderPlayers(connection.lastJsonMessage)}
		  </>
		)}
	  </div>
	)} else if (connection.lastJsonMessage && connection.lastJsonMessage.status === "Draft Already Started") {
	return (
	  <div className="main">
		<h1>Draft already started</h1>
		<p>Please tell your seat token</p>
		<Form onSubmit={reJoinDraft} />
		<Button name="Go Back" onClick={() => setMode("Home")}/>
	  </div>
	)
	}
  else if (connection.lastJsonMessage && connection.lastJsonMessage.status != 'OK') {
	return (
	  <div className="main">
		<h1>Lobby</h1>
		<p>{connection.lastJsonMessage.status}</p>
		<Button name="Go Back" onClick={() => setMode("Home")}/>
	  </div>
	)
  }
}