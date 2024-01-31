import { Button } from '../'
import { useEffect } from 'react'

export const Lobby = ({setMode, connection, token}) => {
  
  const startDraft = () => {
    setMode("Draft")
	connection.sendJsonMessage(JSON.stringify({
	  type: "Start Draft"
	}))
  }

  useEffect(() => {
	connection.sendJsonMessage(JSON.stringify({
	  type: "Join Draft"
	}))}, [])

  return (
	<div className="main">
	  <h1>Lobby</h1>
	  <h2>{token}</h2>
	  <Button name="Start draft" onClick={() => startDraft()}/>
	</div>
  )
}