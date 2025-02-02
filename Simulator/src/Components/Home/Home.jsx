import { MyNavBar, DraftParametersForm, Button, setupDraft, Form, DraftParameterCheckbox } from "../../"
import { useState, useEffect } from 'react'
import { sendMessage } from "../../"


export const Home = ({
  setMode,
  setNumberOfPlayers,
  numberOfPlayers,
  username,
  setUsername,
  connection,
  setOwner,
  setToken,
  setAdmin,
  decryptedMessage
}) => {
  const [draftInitiated, setDraftInitiated] = useState(false)
  const [password, setPassword] = useState("")
  const [commanderPackIncluded, setCommanderPackIncluded] = useState(false)
  const [numOfRounds, setNumOfRounds] = useState(8)
  const [multiRatio, setMultiRatio] = useState(3)
  const [genericRatio, setGenericRatio] = useState(2)
  const [colorlessRatio, setColorlessRatio] = useState(3)
  const [landRatio, setLandRatio] = useState(2)


  const login = (username) => {
    setUsername(username)

    const message = {
      type: "Login",
      username: username
    }

    sendMessage(connection, message)

  }


  const passkey = (value) => {
    setPassword(value)
    
    const message = {
      type: "Admin",
      passkey: value
    }
    
    sendMessage(connection, message)
  
  }


  const changeCommanderPacksIncluded = (e) => {
    setCommanderPackIncluded(!commanderPackIncluded)
    console.log(commanderPackIncluded)
  }


  const submitSetup = (e) => {

    setOwner(true)
    var token = function () {
      return Math.random().toString(36).slice(2, 6)
    }
    const newtoken = token()
    setToken(newtoken)
    setupDraft(newtoken, numberOfPlayers, connection, numOfRounds, multiRatio, genericRatio, colorlessRatio, landRatio, commanderPackIncluded)
    setDraftInitiated(true)
    console.log(newtoken)

  }


  useEffect(() => {
    if (decryptedMessage && decryptedMessage.status === "Setup OK") {
      setMode("Lobby")
    } else if (decryptedMessage && decryptedMessage.status === "Setup Failed") {
      console.log(decryptedMessage.errors)
      alert("Setup failed\n" + decryptedMessage.errors.toString())
      setDraftInitiated(false)

    } else if (decryptedMessage && decryptedMessage.status === "OK" && decryptedMessage.type === "Admin") {
      setAdmin(true)
      console.log("Admin")
    }
  }, [decryptedMessage])


  const joinDraft = (token) => {
    connection.sendJsonMessage({
      type: "Join Draft",
      token: token,
      username: username
    })
    setToken(token)
    setMode("Lobby")

  }


  return !username ? (
    <div className="main">
      <MyNavBar
        onClickDraftNavBar={() => setMode("Home")}
        onClickStatNavBar={() => setMode("Stats")}
      />
      <h1>Home</h1>

      <h2>Who are you?</h2>
      <Form onSubmit={login} name="loginform" />
      {(password === "") ? (
        <>
          <h2>Are you admin?</h2>
          <Form onSubmit={passkey} name="passkey" />
        </>) : (null)}
    </div>
  ) : (
    <div className="main">
      <MyNavBar
        onClickDraftNavbar={() => setMode("Home")}
        onClickStatNavbar={() => setMode("Stats")}
      />
      <h1>Hi {username}</h1>
      {draftInitiated ? (
        <h2>Waiting for response</h2>
      ) : (
        <>
          <h2>Setup a new Draft</h2>
          <DraftParametersForm name="number of players" handleChange={(e) => { e.preventDefault(); setNumberOfPlayers(Number(e.target.value)) }} defaultVal={numberOfPlayers} />
          <DraftParametersForm name="number of rounds" handleChange={(e) => { e.preventDefault(); setNumOfRounds(Number(e.target.value)) }} defaultVal={numOfRounds} />
          <DraftParametersForm name="ratio of multi color pool" handleChange={(e) => { e.preventDefault(); setMultiRatio(Number(e.target.value)) }} defaultVal={multiRatio} />
          <DraftParametersForm name="ratio of generic pool" handleChange={(e) => { e.preventDefault(); setGenericRatio(Number(e.target.value)) }} defaultVal={genericRatio} />
          <DraftParametersForm name="ratio of colorless pool" handleChange={(e) => { e.preventDefault(); setColorlessRatio(Number(e.target.value)) }} defaultVal={colorlessRatio} />
          <DraftParametersForm name="ratio of land pool" handleChange={(e) => { e.preventDefault(); setLandRatio(Number(e.target.value)) }} defaultVal={landRatio} />
          <DraftParameterCheckbox name="Commander pack included" handleChange={changeCommanderPacksIncluded} />

          <Button name="init draft" onClick={(e) => submitSetup()} />

          <h2>Join Draft with a token</h2>

          <Form onSubmit={joinDraft} name="joindraft" />
        </>
      )}
    </div>
  )
}
