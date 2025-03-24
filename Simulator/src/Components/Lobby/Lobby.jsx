
import { sendMessage } from '../../Services'
import { LobbyFailed, LobbySuccess, DraftStarted } from '../'


export const Lobby = ({ connection, numberOfPlayers, owner, token, playersInLobby, lobbyMode, playerList, setMode }) => {

  const startDraft = () => {
    const message = {
      type: "Start Draft",
      token: token
    }
    sendMessage(connection, message)
  }

  return (
      <div className='main'>
      {lobbyMode == "LobbySuccess" &&
       (<LobbySuccess 
          owner={owner}
          token={token}
          playersInLobby={playersInLobby}
          numberOfPlayers={numberOfPlayers}
          startDraft={startDraft}
          playerList={playerList}
       />)}
      {lobbyMode == "LobbyFull" && (<LobbyFailed setMode={setMode} />)}
      {lobbyMode == "DraftStarted" && (<DraftStarted setMode={setMode}/>)}
      {lobbyMode == "LobbyFailed" && (<LobbyFailed setMode={setMode} />)}
      </div>
  )

}