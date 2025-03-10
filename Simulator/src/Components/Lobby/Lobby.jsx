import { Button } from '../'
import { useState } from 'react'
import { useEffect } from 'react'
import { sendMessage } from '../../Services'


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
    
    const message = {
      type: "Start Draft",
      token: token
    }
  
    sendMessage(connection, message)

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
        {owner === "T" ? (
          <><h2>Draft Token: {token}</h2>
            {playersInLobby === numberOfPlayers ? (
              <>
                <h2>Everyone is here</h2><h2>Players:</h2>
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
        <p></p>
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