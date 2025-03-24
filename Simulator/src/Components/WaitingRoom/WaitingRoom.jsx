import { Button } from "../../"

export const WaitingRoom = ({ setMode }) => {

  const cancelSetup = () => {
    setMode("Home")
  }

  return (
    <div className="main">
      <h1>Waiting for server response</h1>
      <Button name="Cancel" onClick={() => cancelSetup()} />
    </div>
)}