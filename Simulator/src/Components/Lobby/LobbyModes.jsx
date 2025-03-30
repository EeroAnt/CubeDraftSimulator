import { Button } from "../";
import styles from './Lobby.module.css'

export const DraftStarted = ({ setMode }) => {
  return (
    <>
      <h1>Draft already started</h1>
      <p></p>
      <Button name="Go Back" onClick={() => setMode("Home")} />
    </>
  )
}

export const LobbyFailed = ({ setMode }) => {
  return (
    <>
      <h1>Not in Lobby</h1>
      <Button name="Go Back" onClick={() => setMode("Home")} />
    </>
  )
}

export const LobbyFull = ({ setMode }) => {
  return (
    <>
      <h1>Lobby Full</h1>
      <Button name="Go Back" onClick={() => setMode("Home")} />
    </>
  )
}

export const LobbySuccess = ({ owner, token, playersInLobby, numberOfPlayers, startDraft, playerList }) => {
  const renderPlayers = playerList => {
    return (
      <ul>
        {Object.keys(playerList).map(uuid => {
          return <li key={uuid}>{playerList[uuid]}</li>
        })}
      </ul>
    )
  }
  return (
    <>
      <h1>Lobby</h1>
      {owner === "T" ? (
        <><h2>Draft Token: {token}</h2>
          {playersInLobby == numberOfPlayers ? (
            <>
              <h2>Everyone is here</h2><h2>Players:</h2>
              {renderPlayers(playerList)}
              <Button name="Start Draft" className={styles.button} onClick={startDraft} />
            </>
          ) : (
            <>
              <h3>Waiting for all players to join</h3>
              <h2>Playercount: </h2>
              <p>{playersInLobby} / {numberOfPlayers}</p>
              <h2>Players present:</h2>
              {renderPlayers(playerList)}
            </>
          )}
        </>
      ) : (
        <>
          <h2>Draft Token: {token}</h2>
          <h2>Players present:</h2>
          {renderPlayers(playerList)}
        </>
      )}
    </>
  )
}