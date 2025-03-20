import { Login, Menu, CreateDraft, JoinDraft } from "./HomeModes"
import styles from "./Home.module.css"

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
  setDraftInitiated,
  drafts
}) => {

  return (
    <div className={styles.main}>
      <div className={styles.menu}>
        {homeMode === "Login" && (
          <Login
            setUsername={setUsername}
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
            drafts={drafts}
          />
        )}
      </div>
    </div>
  )
}
