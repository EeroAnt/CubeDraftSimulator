import styles from './NavBar.module.css';
import { Button, ManaSymbol } from '..'
import { useState } from 'react';
import { sendMessage } from '../../Services';
import { useEffect } from 'react';
import React from 'react';

export function DraftNavbar({ onClickNavbar, buttonName, queues, statsButton }) {
  const [queueDisplay, setQueueDisplay] = useState("")


  useEffect(() => {
    const displayToSet = queues.map((queue, index) => (
      <React.Fragment key={queue.username}>
        {queue.hand === 1 ? <strong>{queue.username}</strong> : queue.username} : {queue.queue}
        {index < queues.length - 1 && ", "}
      </React.Fragment>
    ));

    setQueueDisplay(displayToSet)
  }, [queues])

  return (
    <div className={styles.navbar}>
      <div className={styles.leftSection}>
        {statsButton ? (
          <Button name={buttonName} className="button" onClick={onClickNavbar} />
        ) : null}
      </div>
      <div className={styles.centerSection}>
        {queueDisplay}
      </div>
    </div>
  );
}

export function PostDraftNavBar({ owner, connection, token, basicLands, setBasicLands, commanders, main, side }) {
  const [draftDataDecision, setDraftDataDecision] = useState(true)


  const BasicLands = () => {
    const landTypes = ["W", "U", "B", "R", "G", "C"]
    return (
      <div className={styles.basiclands}>
        <>Basic Lands</>
        {landTypes.map((land, index) => {
          return (
            <>
              <ManaSymbol key={index} symbol={land} />
              <input
                className={styles.basiclandinput}
                type="number"
                value={basicLands[index]}
                onChange={(e) => { setBasicLands(basicLands.map((value, i) => i === index ? parseInt(e.target.value) : value)) }}></input>
            </>)
        })
        }
      </div>
    )
  }


  const handleDataDecision = (value) => {
    setDraftDataDecision(false)
    const message = { type: "Draft Data Decision", token: token, decision: value }
    sendMessage(connection, message)
  }

  const copyDeckToClipBoard = () => {
    const deck = []
    commanders.forEach((commander) => {
      deck.push("1 " + commander.name)
    })
    main.forEach((card) => {
      deck.push("1 " + card.name)
    })
    basicLands.forEach((land, index) => {
      if (land > 0) {
        deck.push(land + " " + ["Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes"][index])
      }
    })
    deck.push("")
    side.forEach((card) => {
      deck.push("1 " + card.name)
    })
    navigator.clipboard.writeText(deck.join("\n"))
  }

  return (<div className={styles.navbar}>
    <div className={styles.leftSection}>
      <Button name="Copy Deck to Clipboard" className="button" onClick={() => copyDeckToClipBoard()} />
      {owner === "T" && draftDataDecision ? (<>
        <Button name="Validate draft data" className="button" onClick={() => handleDataDecision(true)} />
        <Button name="Ignore draft data" className="button" onClick={() => handleDataDecision(false)} />
      </>) : ""}
    </div>
    <div className={styles.landSection}>
      {BasicLands()}
    </div>
  </div>
  );
}