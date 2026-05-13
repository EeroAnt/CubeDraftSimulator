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
  basicLands,
  token,
  partnerRules,
  removeTagFromCard
}) => {
  const headerRef = createRef()


  const switchView = () => {
    setShowMain(!showMain)
    setSelectedCards([])
  }

  const handleBasicFilters = (cards, commanders) => {
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
    } else {
      return true;
    }
    return false;
  }


  const handlePartnerRule = (commanders, selectedCards, partnerRules) => {
    if (commanders.length === 1) {
      const combined = [...new Set([...commanders[0].color_identity.split(""), ...selectedCards[0].color_identity.split("")])]
      switch (partnerRules) {
        case 0:
          if (
            ((selectedCards[0].color_identity.length > 2 || commanders[0].color_identity.length > 2) ||
            selectedCards[0].types.includes("God") || commanders[0].types.includes("God"))
          ) {
          alert("Non-gods with less than 3 colors in their color identity have partner")
          return false
        }
        break;
        case 1:
          if (
            combined.length > 4 ||
            selectedCards[0].types.includes("God") || commanders[0].types.includes("God")
          ) {
            alert("Non-gods can partner up to 4 colors in their color identity")
            return false
          }
        break;
        case 2:
          return true;
      }
    }
    return true;
  }

  const appointCommander = () => {
    const basicFilter = handleBasicFilters(selectedCards, commanders)
    const partnerFilter = handlePartnerRule(commanders, selectedCards, partnerRules)
    if (basicFilter && partnerFilter) {
      console.log("Setting commander:", selectedCards[0].name)
      const message = {
        type: "Set Commander",
        token: token,
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
    if (headerRef.current) {

      const adjustBodyPosition = () => {
        const headerHeight = headerRef.current.clientHeight;
        const screenHeight = window.innerHeight;
        const bodyElement = document.querySelector('.sidenavmain');

        if (!bodyElement) return;

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
    }
  }, [lastClicked, headerRef]);



  return (
    <div className={styles.sidenav}>
      <div className={styles.sidenavheader} ref={headerRef}>
        {Object.keys(lastClicked).length === 0 ? (
          <Image imageUrl={defaultImageUrl} backsideUrl="" />
        ) : (
          <>
            <Image imageUrl={lastClicked.image_url} backsideUrl={lastClicked.backside_image_url} />
            {lastClicked.tags && lastClicked.tags.length > 0 && (
              <div className={styles.cardTags}>
                {lastClicked.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                    <span
                      className={styles.tagRemove}
                      onClick={() => removeTagFromCard(lastClicked.id, tag)}
                    >
                      ✕
                    </span>
                  </span>
                ))}
              </div>
            )}
          </>
        )}
        <p>
          <Button name={showMain ? ("Show Side") : ("Show Main")} className={styles.button} onClick={() => switchView()} />
          <Button name={showMain ? ("Move to Side") : ("Move to Main")} className={styles.button} onClick={() => moveCards()} />
        </p>
        <p><Button
          name={selectedCommanders.length === 1 ? (showMain ? "Move Commander to Main" : "Move Commander to Side") : "Set Commander"}
          className={styles.button}
          onClick={selectedCommanders.length === 1 ? (() => removeCommander()) : (() => appointCommander())} /></p>
        <div className={styles.commander}>
          <span className={styles.text}>Commanders</span>
          <span className={styles.ulcardlist} />
          {commanderColorIdentity.map((color, index) => (
            <span key={index} className={styles.manasymbol}>
              <ManaSymbol symbol={color} />
            </span>
          ))}
        </div>

        <ul className={styles.ulcardlist}>
          {commanders.map((card, index) => (
            <li key={index} className={selectedCommanders.includes(card) ? (styles.clicked) : (styles.notClicked)} onClick={() => selectCommander(card)}>{card.name}</li>
          ))}
        </ul>
        <span className={styles.text}>
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
      <div className={styles.sidenavmain}>
        {showMain ? (
          <ul className={styles.ulcardlist}>
            {main.map((card, index) => (
              <li key={index} className={selectedCards.includes(card) ? (styles.clicked) : (styles.notClicked)} onClick={() => selectCards(card)}>{card.name}</li>
            ))}
          </ul>
        ) : (
          <ul className={styles.ulcardlist}>
            {side.map((card, index) => (
              <li key={index} className={selectedCards.includes(card) ? (styles.clicked) : (styles.notClicked)} onClick={() => selectCards(card)}>{card.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}