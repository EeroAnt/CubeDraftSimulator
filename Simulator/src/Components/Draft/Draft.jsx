import { Button } from "../";

export const Draft = ({setMode, connection}) => {


  return (
	<div className="main">
	  <h1>Draft</h1>
	  <Button name="test" onClick={() => connection.sendJsonMessage(JSON.stringify({type: "Join Draft"}))}/>
	</div>
  )
}