import { useEffect, createRef } from "react";
import { Image, Button, ManaSymbol } from "../";
import { sendMessage } from "../../Services";
import styles from './SideBar.module.css'

export const SideBar = ({
  lastClicked,
  showMain,
  selectedCommanders,
  commanderColorIdentity,
  commanders,
  mainColorIdentity,
  main,
  side,
  selectedCards,
  selectCards,
  selectCommander,
  moveCards,
  setShowMain,
  setSelectedCards,
  connection,
  basicLands
}) => {
  const headerRef = createRef()


  const switchView = () => {
    setShowMain(!showMain)
    setSelectedCards([])
  }


  const appointCommander = () => {
    if (selectedCards.length === 0) {
      alert("No card selected")
    } else if (commanders.length === 2) {
      alert("You can have at most two commanders")
    } else if (selectedCards.length > 1) {
      alert("You can only set one commander at a time")
    } else if ((!selectedCards[0].types.includes("Legendary")
       || !selectedCards[0].types.includes("Creature"))
       && !selectedCards[0].oracle_text.includes(" can be your commander")) {
      alert("Only legendary creatures can be commanders")
    } else if (commanders.length === 1 &&
      ((selectedCards[0].color_identity.length > 2 || commanders[0].color_identity.length > 2) ||
        selectedCards[0].types.includes("God") || commanders[0].types.includes("God"))) {
      alert("Our house rules apply partner-rule to non-gods with less than 3 colors in their color identity")
    } else {
      const message = {
        type: "Set Commander",
        card: selectedCards[0].id
      }
      sendMessage(connection, message)
    }
    setSelectedCards([])
  }


  const removeCommander = () => {
    if (selectedCommanders.length === 1) {
      const target = showMain ? ("main") : ("side")
      const message = {
        type: "Remove Commander",
        card: selectedCommanders[0].id,
        zone: target
      }
      sendMessage(connection, message)
    } else {
      alert("No commander selected")
    }
  }


  const defaultImageUrl = "https://cards.scryfall.io/large/front/3/0/308ac133-f368-4f6c-9e09-d9cfc136355a.jpg?1605483061"


  useEffect(() => {
    const adjustBodyPosition = () => {
      const headerHeight = headerRef.current.clientHeight;
      const screenHeight = window.innerHeight;
      const bodyElement = document.querySelector('.sidenav-body');
      bodyElement.style.top = `${headerHeight}px`;
      bodyElement.style.height = `${screenHeight - headerHeight}px`;
    };


    // Call adjustBodyPosition initially and on window resize
    adjustBodyPosition();
    window.addEventListener('resize', adjustBodyPosition);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', adjustBodyPosition);
    };
  }, [lastClicked, headerRef]);



  return (
    <div className="sidenav">
      <div className="sidenav-header" ref={headerRef}>
        {Object.keys(lastClicked).length === 0 ? (
          <Image imageUrl={defaultImageUrl} backsideUrl="" />
        ) : (
          <Image imageUrl={lastClicked.image_url} backsideUrl={lastClicked.backside_image_url} />
        )}
        <p>
          <Button name={showMain ? ("Show Side") : ("Show Main")} className={styles.button} onClick={() => switchView()} />
          <Button name={showMain ? ("Move to Side") : ("Move to Main")} className={styles.button} onClick={() => moveCards()} />
        </p>
        <p><Button
          name={selectedCommanders.length === 1 ? (showMain ? "Move Commander to Main" : "Move Commander to Side") : "Set Commander"}
          className={styles.button}
          onClick={selectedCommanders.length === 1 ? (() => removeCommander()) : (() => appointCommander())} /></p>
        <div className="commander">
          <span className="text">Commanders</span>
          {commanderColorIdentity.map((color, index) => (
            <span key={index} className={styles.manasymbol}>
              <ManaSymbol symbol={color} />
            </span>
          ))}
        </div>

        <ul className="ulcardlist">
          {commanders.map((card, index) => (
            <li key={index} className={selectedCommanders.includes(card) ? ("clicked") : ("notClicked")} onClick={() => selectCommander(card)}>{card.name}</li>
          ))}
        </ul>
        <span className="text">
          {showMain ? (
            <>
              {`Main ${basicLands
                  ? main.length +
                  basicLands.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                  : main.length
                } /${100 - commanders.length}`}
              {mainColorIdentity.length > 0 && (
                <span className={styles.manasymbols}>
                  {mainColorIdentity.map((color, index) => (
                    <span key={index} className={styles.manasymbol}>
                      <ManaSymbol symbol={color} />
                    </span>
                  ))}
                </span>
              )}
            </>
          ) : (
            "Side"
          )}
        </span>
      </div>
      <div className="sidenav-body">
        {showMain ? (
          <ul className="ulcardlist">
            {main.map((card, index) => (
              <li key={index} className={selectedCards.includes(card) ? ("clicked") : ("notClicked")} onClick={() => selectCards(card)}>{card.name}</li>
            ))}
          </ul>
        ) : (
          <ul className="ulcardlist">
            {side.map((card, index) => (
              <li key={index} className={selectedCards.includes(card) ? ("clicked") : ("notClicked")} onClick={() => selectCards(card)}>{card.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}