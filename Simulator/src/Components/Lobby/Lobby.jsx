import { Button, Form } from '../'
import { useState } from 'react'
import { useEffect } from 'react'


const renderPlayers = message => {
  return (
    <ul>
      {Object.keys(message.players).map(uuid => {
        return <li key={uuid}>{message.players[uuid]}</li>
      })}
    </ul>
  )
}



export const Lobby = ({ setMode, connection, numberOfPlayers, owner, token, decryptedMessage }) => {

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
    if (decryptedMessage && decryptedMessage.players) {
      const numPlayers = Object.keys(decryptedMessage.players).length;
      setPlayersInLobby(numPlayers)
    } else if (decryptedMessage && decryptedMessage.status === "OK") {
      setMode("Draft")
    } else if (decryptedMessage && decryptedMessage.status === "Draft Already Started") {
      console.log(decryptedMessage.status)
    } else if (decryptedMessage && decryptedMessage.status != "OK") {
      console.log(decryptedMessage.status)
    }
  }, [decryptedMessage, numberOfPlayers])


  if (decryptedMessage && decryptedMessage.status === "OK" && decryptedMessage.type === "Playerlist") {
    return (
      <div className="main">
        <h1>Lobby</h1>
        {owner ? (
          <><h2>Draft Token: {token}</h2>
            {playersInLobby === numberOfPlayers ? (
              <>
                <h2>Everyone's here</h2><h2>Players:</h2>
                {renderPlayers(decryptedMessage)}
                <Button name="Start Draft" onClick={startDraft} />
              </>
            ) : (
              <>
                <h3>Waiting for all players to join</h3>
                <h2>Playercount: </h2>
                <p>{playersInLobby} / {numberOfPlayers}</p>
                <h2>Players present:</h2>
                {renderPlayers(decryptedMessage)}
              </>
            )}
          </>
        ) : (
          <>
            <h2>Draft Token: {token}</h2>
            <h2>Players present:</h2>
            {renderPlayers(decryptedMessage)}
          </>
        )}
      </div>
    )
  } else if (decryptedMessage && decryptedMessage.status === "Draft Already Started") {
    return (
      <div className="main">
        <h1>Draft already started</h1>
        <p>Please tell your seat token</p>
        <Form onSubmit={reJoinDraft} />
        <Button name="Go Back" onClick={() => setMode("Home")} />
      </div>
    )
  }
  else if (decryptedMessage && decryptedMessage.status != 'OK') {
    return (
      <div className="main">
        <h1>Not in Lobby</h1>
        <p>{decryptedMessage.status}</p>
        <Button name="Go Back" onClick={() => setMode("Home")} />
      </div>
    )
  }
}