import { Button } from '../'
import { useEffect } from 'react'

export const DeckBuilder = ({setMode}) => {
  
  return (
	<div className="main">
	  <h1>We made it!</h1>
	  <Button name="Go Back" onClick={() => setMode("Home")}/>
	</div>
  )
}