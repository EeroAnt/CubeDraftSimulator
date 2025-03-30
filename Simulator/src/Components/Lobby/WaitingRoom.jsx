import { Button } from "../../"
import styles from './Lobby.module.css'

export const WaitingRoom = ({ setMode }) => {

  const cancelSetup = () => {
    setMode("Home")
  }

  return (
    <div className={styles.main}>
      <h1>Waiting for server response</h1>
      <Button name="Cancel" className="button" onClick={() => cancelSetup()} />
    </div>
)}