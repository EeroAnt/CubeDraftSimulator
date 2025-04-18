import {
  Form,
  Button,
  sendMessage,
  DraftParametersForm,
  DraftParameterCheckbox,
  setupDraft
} from "../../";
import { useState } from 'react';
import styles from './Home.module.css'



export const Login = ({ setUsername, connection, setHomeMode }) => {

  const login = (username) => {
    if (username === "") {
      return
    }
    setUsername(username)
    const message = {
      type: "Login",
      username: username
    }
    sendMessage(connection, message)
    setHomeMode("Menu")
  }

  return (
    <>
      <h2>Who dares to enter?</h2>
      <div className="formcontainer">
        <Form onSubmit={login} name="loginform" />
      </div>
    </>
  );
}

export const Menu = ({ username, setUsername, setHomeMode, connection }) => {

  const logout = () => {
    setHomeMode("Login")
    setUsername("")
  }

  const goToJoin = () => {
    sendMessage(connection, { type: "Get Lobbies" })
    setHomeMode("Join")
  }

  return (
    <div>
      <h1>Oh hi {username}!</h1>
      <h3>What would you like to do?</h3>
      <Button name="Create draft" className={styles.button} onClick={() => setHomeMode("Create")} />
      <Button name="Join draft" className={styles.button} onClick={() => goToJoin()} />
        <br />
      <Button name="Go Back" className={styles.button} onClick={() => logout()} />
    </div>
  )
}

export const CreateDraft = ({ setMode, numberOfPlayers, setNumberOfPlayers, setOwner, setToken, setDraftInitiated, setHomeMode, connection }) => {

  const [commanderPackIncluded, setCommanderPackIncluded] = useState(false)
  const [numOfRounds, setNumOfRounds] = useState(8)
  const [multiRatio, setMultiRatio] = useState(3)
  const [genericRatio, setGenericRatio] = useState(2)
  const [colorlessRatio, setColorlessRatio] = useState(3)
  const [landRatio, setLandRatio] = useState(2)

  const changeCommanderPacksIncluded = () => {
    setCommanderPackIncluded(!commanderPackIncluded)
  }

  const submitSetup = () => {
    setOwner("T")
    var token = function () {
      return Math.random().toString(36).slice(2, 6)
    }
    const newtoken = token()
    setToken(newtoken)
    setupDraft(newtoken, numberOfPlayers, connection, numOfRounds, multiRatio, genericRatio, colorlessRatio, landRatio, commanderPackIncluded, setMode)
    setDraftInitiated(true)
  }

  return (
    <div>
      <h2>A draft you say? What kind?</h2>
      <div className={styles.formcontainer}>
        <DraftParametersForm name="number of players" handleChange={(e) => { e.preventDefault(); setNumberOfPlayers(Number(e.target.value)) }} defaultVal={numberOfPlayers} />
        <DraftParametersForm name="number of rounds" handleChange={(e) => { e.preventDefault(); setNumOfRounds(Number(e.target.value)) }} defaultVal={numOfRounds} />
        <DraftParametersForm name="ratio of multi color pool" handleChange={(e) => { e.preventDefault(); setMultiRatio(Number(e.target.value)) }} defaultVal={multiRatio} />
        <DraftParametersForm name="ratio of generic pool" handleChange={(e) => { e.preventDefault(); setGenericRatio(Number(e.target.value)) }} defaultVal={genericRatio} />
        <DraftParametersForm name="ratio of colorless pool" handleChange={(e) => { e.preventDefault(); setColorlessRatio(Number(e.target.value)) }} defaultVal={colorlessRatio} />
        <DraftParametersForm name="ratio of land pool" handleChange={(e) => { e.preventDefault(); setLandRatio(Number(e.target.value)) }} defaultVal={landRatio} />
      </div>
      <DraftParameterCheckbox name="Commander pack included" handleChange={changeCommanderPacksIncluded} />
      <Button name="init draft" className={styles.button} onClick={() => submitSetup()} />
      <Button name="Go Back" className={styles.button} onClick={() => setHomeMode("Menu")} />
    </div>
  )
}

export const JoinDraft = ({ setToken, setMode, setHomeMode, username, connection, drafts }) => {

  const joinLobby = (token) => {
    const message = {
      type: "Join Lobby",
      token: token,
      username: username
    }
    sendMessage(connection, message)
    setToken(token)
    setMode("Lobby")
  }

  return (
    <div>
      {drafts && drafts.length > 0 && drafts
        .filter(draft => draft.players > 0).length > 0
        ? (
          <>
            <h2>Pick and choose!</h2>
            <h3>Any lobby you&apos;d like</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Players</th>
                  <th>Max Players</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {drafts.filter(draft => draft.players > 0)
                  .map((draft, index) => (
                    <tr key={index}>
                      <td>{draft.token}</td>
                      <td>{draft.players}</td>
                      <td>{draft.maxPlayers}</td>
                      <td>
                        {draft.players < draft.maxPlayers ? (
                          <Button name="Join" className={styles.button} onClick={() => joinLobby(draft.token)} />
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        ) : (
          <h2>There are no drafts<br/> to be found</h2>
        )
      }
      <Button name="Go Back" className={styles.button} onClick={() => setHomeMode("Menu")} />
    </div>
  )
}