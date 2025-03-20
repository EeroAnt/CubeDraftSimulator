import styles from './App.module.css'
import { Home, Draft, Lobby, PostDraft, WaitingRoom } from '../'
import { useGameState } from '../../Hooks/useGameState'

export const App = () => {
  const gameState = useGameState()

  return (
    <div className={styles.App}>

      {gameState.mode === "Home" && (
        <Home {...gameState} />
      )}

      {gameState.mode === "Lobby" && (
        <Lobby {...gameState} />
      )}

      {gameState.mode === "Draft" && (
        <Draft {...gameState} />
      )}

      {gameState.mode === "Post Draft" && (
        <PostDraft {...gameState} />
      )}

      {gameState.mode === "Waiting" && (
        <WaitingRoom {...gameState} />
      )}
    </div>
  )
}