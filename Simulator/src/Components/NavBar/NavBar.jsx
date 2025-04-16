import styles from './NavBar.module.css';
import { Button, ManaSymbol } from '..'
import { useState } from 'react';
import { sendMessage } from '../../Services';
import { useEffect } from 'react';
import React from 'react';

export function DraftNavbar({ onClickNavbar, buttonName, queues, statsButton, round }) {
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
        <div className={styles.round}>
          Round: {(round == 0 ? "Commander" : round)}
        </div>
      </div>
      <div className={styles.centerSection}>
        {queueDisplay}
      </div>
    </div>
  );
}

export function PostDraftNavBar({ owner, connection, token, basicLands, setBasicLands, commanders, main, side }) {
  const [draftDataDecision, setDraftDataDecision] = useState(true)

  const handleBasicLandChange = (index, value) => {
    const parsed = parseInt(value);
    const newValue = (!isNaN(parsed) && parsed >= 0) ? Math.min(parsed, 99) : 0;

    setBasicLands(basicLands.map((v, i) => i === index ? newValue : v));
  };

  const BasicLands = () => {
    const landTypes = ["W", "U", "B", "R", "G", "C"]
    return (
      <div className={styles.basiclands}>
        <>Basic Lands</>
        {landTypes.map((land, index) => {
          return (
            <React.Fragment key={land + index}>
              <ManaSymbol key={index} symbol={land} />
              <div className={styles.basiclandinputwrapper}>
                <span className={styles.basiclandvalue}>
                  {basicLands[index].toString().padStart(2, '0')}
                </span>
                <div className={styles.basiclandbuttonstack}>
                  <button onClick={() => handleBasicLandChange(index, basicLands[index] + 1)}>+</button>
                  <button onClick={() => handleBasicLandChange(index, basicLands[index] - 1)}>-</button>
                </div>
              </div>
            </React.Fragment>
          )
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
    const deckString = deck.join("\n");

    // Fallback prompt if clipboard API isn't available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(deckString)
        .then(() => console.log("Copied to clipboard!"))
        .catch((err) => {
          console.error("Clipboard write failed:", err);
          window.prompt("Copy the deck:", deckString);
        });
    } else {
      const popup = window.open("", "Deck Export", "width=600,height=800");
      if (popup) {
        popup.document.title = "Deck Export";
        const textarea = popup.document.createElement("textarea");
        textarea.value = deckString;
        textarea.style.width = "100%";
        textarea.style.height = "100%";
        textarea.style.border = "none";
        textarea.style.outline = "none";
        textarea.style.fontFamily = "monospace";
        textarea.style.fontSize = "14px";
        popup.document.body.style.margin = "0";
        popup.document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
      } else {
        window.prompt("Copy the deck:", deckString); // ultimate fallback
      }
    }
  }

  return (
    <div className={styles.navbar}>
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