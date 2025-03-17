import { useEffect } from "react"
import { Button } from "../../"

export const WaitingRoom = ({ setMode, decryptedMessage, setDraftInitiated }) => {
  useEffect(() => {
    if (decryptedMessage && decryptedMessage.status === "Setup OK") {
      setMode("Lobby")
    } else if (decryptedMessage && decryptedMessage.status === "Setup Failed") {
      console.log(decryptedMessage.errors)
      alert("Setup failed\n" + decryptedMessage.errors.toString())
      setDraftInitiated(false)

    } 
  }, [decryptedMessage])

  const cancelSetup = () => {
    setMode("Home")
  }

  return (
    <div className="main">
      <h1>Waiting for server response</h1>
      <Button name="Cancel" onClick={() => cancelSetup()} />
    </div>
)}