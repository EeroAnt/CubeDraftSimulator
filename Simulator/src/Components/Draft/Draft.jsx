import { Button, Image } from "../";
import { useState, useEffect } from "react";
import './draft.css'


export const Draft = ({setMode, connection, token}) => {
  const [pack, setPack] = useState([])
  const [pick, setPick] = useState(0)

  useEffect(() => {
	if (connection.lastJsonMessage && connection.lastJsonMessage.type === "Pack") {
	  setPack(connection.lastJsonMessage.pack)
	} else if (connection.lastJsonMessage && connection.lastJsonMessage.type === "End Draft") {
	  setMode("DeckBuilder")
	}
  }, [connection.lastJsonMessage])

  const chooseCard = (card) => {
	setPick(card.id)
	console.log(card.id)
  }

  const confirmPick = (target) => {
	if (pick) {
	connection.sendJsonMessage({
	  type: "Pick",
	  card: pick,
	  zone: target,
	  token: token
	})
	setPick(0)
	setPack([])
	} else {
	  console.log("No card picked")
	}
  }

  if (pack) {
    return (
	  <div className="main">
	    <h1>Draft</h1>
	    {pack ? (
		  <>
		  <Button name="Pick to main" onClick={() => confirmPick("main")}/>
		  <Button name="Pick to side" onClick={() => confirmPick("side")}/>
        <table className="pack">
          <tbody>
            {pack.reduce((rows, card, index) => {
              if (index % 5 === 0) rows.push([]); // Start a new row every 5 cards
              rows[rows.length - 1].push(
                <td key={index} className={pick === card.id ? ("selected") : ("card")} onClick={() => chooseCard(card)}>
                  <Image imageUrl={card.image_url} backsideUrl={card.backsideUrl}/>
                </td>
              );
              return rows;
            }, []).map((row, rowIndex) => (
              <tr key={rowIndex}>{row}</tr>
            ))}
          </tbody>
        </table>
		</>		
	    ) : (
		  <h2>Waiting for pack</h2>
	    )}
	  </div>
    );
  } else {
	return (
	  <div className="main">
		<h1>Draft</h1>
		<h2>Waiting for pack</h2>
	  </div>
	);
  }
}