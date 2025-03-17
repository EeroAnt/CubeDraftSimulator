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
  setDraftInitiated
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
       /> 
      )}
    </div>
  )
  //   <div className="main">
  //     <HomeNavBar />
  //     <h1>Hi {username}</h1>
  //     {draftInitiated ? (
  //       <h2>Waiting for response</h2>
  //     ) : (
  //       <>
  // <h2>Setup a new Draft</h2>
  // <DraftParametersForm name="number of players" handleChange={(e) => { e.preventDefault(); setNumberOfPlayers(Number(e.target.value)) }} defaultVal={numberOfPlayers} />
  // <DraftParametersForm name="number of rounds" handleChange={(e) => { e.preventDefault(); setNumOfRounds(Number(e.target.value)) }} defaultVal={numOfRounds} />
  // <DraftParametersForm name="ratio of multi color pool" handleChange={(e) => { e.preventDefault(); setMultiRatio(Number(e.target.value)) }} defaultVal={multiRatio} />
  // <DraftParametersForm name="ratio of generic pool" handleChange={(e) => { e.preventDefault(); setGenericRatio(Number(e.target.value)) }} defaultVal={genericRatio} />
  // <DraftParametersForm name="ratio of colorless pool" handleChange={(e) => { e.preventDefault(); setColorlessRatio(Number(e.target.value)) }} defaultVal={colorlessRatio} />
  // <DraftParametersForm name="ratio of land pool" handleChange={(e) => { e.preventDefault(); setLandRatio(Number(e.target.value)) }} defaultVal={landRatio} />
  // <DraftParameterCheckbox name="Commander pack included" handleChange={changeCommanderPacksIncluded} />

  // <Button name="init draft" onClick={() => submitSetup()} />

  //         <h2>Join Draft with a token</h2>

  //         <Form onSubmit={joinLobby} name="joindraft" />
  //       </>
  //     )}
  //   </div>
  // )
}
