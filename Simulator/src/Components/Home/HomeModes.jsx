import {
  Form,
  Button,
  sendMessage,
  DraftParametersForm,
  DraftParameterCheckbox,
  setupDraft
} from "../../";
import { useState } from 'react';



export const Login = ({ setUsername, connection, setHomeMode }) => {

  const login = (username) => {
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
      <h1>Home</h1>
      <h2>Who are you?</h2>
      <div className="form-container">
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
      <h1>Hi {username}</h1>
      <Button name="Create draft" onClick={() => setHomeMode("Create")} />
      <Button name="Join draft" onClick={() => goToJoin()} />
      <Button name="Back" onClick={() => logout()} />
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
    console.log(newtoken)
  }

  return (
    <div>
      <h2>Setup a new Draft</h2>
      <DraftParametersForm name="number of players" handleChange={(e) => { e.preventDefault(); setNumberOfPlayers(Number(e.target.value)) }} defaultVal={numberOfPlayers} />
      <DraftParametersForm name="number of rounds" handleChange={(e) => { e.preventDefault(); setNumOfRounds(Number(e.target.value)) }} defaultVal={numOfRounds} />
      <DraftParametersForm name="ratio of multi color pool" handleChange={(e) => { e.preventDefault(); setMultiRatio(Number(e.target.value)) }} defaultVal={multiRatio} />
      <DraftParametersForm name="ratio of generic pool" handleChange={(e) => { e.preventDefault(); setGenericRatio(Number(e.target.value)) }} defaultVal={genericRatio} />
      <DraftParametersForm name="ratio of colorless pool" handleChange={(e) => { e.preventDefault(); setColorlessRatio(Number(e.target.value)) }} defaultVal={colorlessRatio} />
      <DraftParametersForm name="ratio of land pool" handleChange={(e) => { e.preventDefault(); setLandRatio(Number(e.target.value)) }} defaultVal={landRatio} />
      <DraftParameterCheckbox name="Commander pack included" handleChange={changeCommanderPacksIncluded} />
      <Button name="init draft" onClick={() => submitSetup()} />
      <Button name="Back" onClick={() => setHomeMode("Menu")} />
    </div>
  )
}

export const JoinDraft = ({ setToken, setMode, setHomeMode, username, connection, drafts }) => {



  const getDrafts = () => {
    const message = {
      type: "Get Lobbies"
    }
    sendMessage(connection, message)
  }


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
      <h2>Join Draft with a token</h2>
      <Form onSubmit={joinLobby} name="joinDraftForm" />
      <Button name="Back" onClick={() => setHomeMode("Menu")} />
      <Button name="Get Lobbies" onClick={() => getDrafts()} />

      {drafts && drafts
        .filter(draft => draft.players > 0)
        .map((draft, index) => {
          console.log(draft)
          return (
          <div key={index}>
            <p>{draft.token} {draft.players} / {draft.maxPlayers}</p>
            {draft.players < draft.maxPlayers && (
              <Button name="Join" onClick={() => joinLobby(draft.token)} />
            )}
          </div>
        )})}
    </div>
  )
}