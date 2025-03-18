import { HomeNavBar } from "../../"
import { Login, Menu, CreateDraft, JoinDraft } from "./HomeModes"


export const Home = ({
  setMode,
  homeMode,
  setHomeMode,
  setNumberOfPlayers,
  numberOfPlayers,
  username,
  setUsername,
  connection,
  setOwner,
  setToken,
  admin,
  setDraftInitiated,
  decryptedMessage
}) => {

  return (
    <div className="main">
      <HomeNavBar />
      {homeMode === "Login" && (
        <Login
          setUsername={setUsername}
          admin={admin}
          connection={connection}
          setHomeMode={setHomeMode}
        />
      )}
      {homeMode === "Menu" && (
        <Menu
          username={username}
          setUsername={setUsername}
          setHomeMode={setHomeMode}
          connection={connection}
        />
      )}
      {homeMode === "Create" && (
        <CreateDraft
          setMode={setMode}
          numberOfPlayers={numberOfPlayers}
          setNumberOfPlayers={setNumberOfPlayers}
          setOwner={setOwner}
          setToken={setToken}
          setDraftInitiated={setDraftInitiated}
          setHomeMode={setHomeMode}
          connection={connection}
        />
      )}
      {homeMode === "Join" && (
       <JoinDraft
        setToken={setToken}
        setMode={setMode}
        setHomeMode={setHomeMode}
        username={username}
        connection={connection}
        decryptedMessage={decryptedMessage}
       /> 
      )}
    </div>
  )
}
