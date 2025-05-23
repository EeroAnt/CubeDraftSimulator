import { Button, Image, ManaFilter } from '../';
import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import styles from './Deckbuilder.module.css'


function filterCardsPos(cards, criteria) {
  var filtered = []
  for (let i = 1; i < criteria.length; i++) {
    filtered = filtered.concat(cards.filter(card => card.types.includes(criteria[i])))
  }
  return filtered
}


function filterCardsNeg(cards, criteria) {
  var filtered = [].concat(cards)
  for (let i = 1; i < criteria.length; i++) {
    filtered = filtered.filter(card => !filtered.filter(card => card.types.includes(criteria[i])).includes(card))
  }
  return filtered
}


function amountOfFilteredCardsPos(deck, all, criteria) {
  var deckAmount = 0
  var totalAmount = 0
  for (let i = 0; i < criteria.length; i++) {
    deckAmount += deck.filter(card => card.types.includes(criteria[i])).length
    totalAmount += all.filter(card => card.types.includes(criteria[i])).length
  }
  return `${deckAmount}/${totalAmount}`
}

function amountOfFilteredCardsNeg(deck, all, criteria) {
  var tempDeck = [].concat(deck)
  var tempAll = [].concat(all)
  for (let i = 0; i < criteria.length; i++) {
    tempDeck = tempDeck.filter(card => tempDeck.filter(card => !card.types.includes(criteria[i])).includes(card))
    tempAll = tempAll.filter(card => tempAll.filter(card => !card.types.includes(criteria[i])).includes(card))
  }
  return `${tempDeck.length}/${tempAll.length}`
}


export const DeckBuilder = ({
  main,
  side,
  commanders,
  showMain,
  selectedCards,
  selectCards,
  cardsToDisplay,
  setCardsToDisplay,
  typeFilter,
  setTypeFilter,
  curveOfMain,
  setCurveOfMain,
  curveOfDisplayed,
  setCurveOfDisplayed,
  maxManaValue,
  setMaxManaValue,
  showDeckbuilder,
  colorFilterPos,
  colorFilterNeg,
  setColorFilterPos,
  setColorFilterNeg
}) => {

  const [selectedTypefilter, setSelectedTypefilter] = useState("")
  const [bars, setBars] = useState(true)
  const all = main.concat(side).concat(commanders)
  const deck = main.concat(commanders)
  const criteria = {
    creature: ["Creature"],
    legendaries: ["Legendary"],
    planeswalkers: ["Planeswalker"],
    artifacts: ["Artifact"],
    enchantments: ["Enchantment"],
    instants: ["Instant"],
    sorceries: ["Sorcery"],
    lands: ["Land"],
    auras: ["Aura"],
    equipment: ["Equipment"],
    sagas: ["Saga"],
    historics: ["Artifact", "Legendary", "Saga"],
    nonCreature: ["Creature", "Land", "Consipiracy"],
    permanents: ["Instant", "Sorcery", "Conspiracy"],
    conspiracies: ["Conspiracy"]
  }


  const dataset = curveOfMain.map((mainCount, index) => ({
    main: mainCount,
    displayed: curveOfDisplayed[index],
    manavalue: index
  }));
  const valueFormatter = (value) => `${value}`
  const manaValuesList = Array.from({ length: curveOfMain.length }, (_, index) => index);

  const TypeFilterObject = ({ name, type, criteria, deck, all }) => {
    const filterfunc = type === "Pos" ? amountOfFilteredCardsPos : amountOfFilteredCardsNeg
    if (filterfunc(deck, all, criteria) === "0/0") return null
    return (
      <div className={selectedTypefilter === name ? (styles.current) : (styles.typeFilterObject)} onClick={() => handleTypeFilter([type].concat(criteria), name)}>
        <h5>{name}</h5>
        <p>{filterfunc(deck, all, criteria)}</p>
      </div>
    )
  }

  const ColorFilter = ({ color }) => {
    if (colorFilterPos !== undefined) {
      if (colorFilterPos.includes(color)) {
        return (
          <ManaFilter className={styles.colorIncluded} symbol={color} onClick={() => handleManaFilter(color)} />
        )
      } else if (colorFilterNeg.includes(color)) {
        return (
          <ManaFilter className={styles.colorExcluded} symbol={color} onClick={() => handleManaFilter(color)} />
        )
      } else {
        return (
          <ManaFilter className={styles.colorNeutral} symbol={color} onClick={() => handleManaFilter(color)} />
        )
      }
    }
  }


  const handleManaFilter = (color) => {
    if (!colorFilterPos.includes(color) && !colorFilterNeg.includes(color)) {
      setColorFilterPos(colorFilterPos.concat(color))
    } else if (colorFilterPos.includes(color)) {
      setColorFilterPos(colorFilterPos.filter(c => c !== color))
      setColorFilterNeg(colorFilterNeg.concat(color))
    } else if (colorFilterNeg.includes(color)) {
      setColorFilterNeg(colorFilterNeg.filter(c => c !== color))
    }
  }


  const handleTypeFilter = (type, name) => {

    if (JSON.stringify(typeFilter) === JSON.stringify(type)) {
      setTypeFilter(["All"])
      setSelectedTypefilter("")
    } else {
      setTypeFilter(type)
      setSelectedTypefilter(name)
    }
  }


  useEffect(() => {
    setMaxManaValue(Math.max(...main.concat(side).concat(commanders).map(obj => obj.mana_value)));
    let temp = showMain ? main.concat(commanders) : side
    if (typeFilter[0] !== "All") {
      typeFilter[0] === "Pos"
        ? temp = filterCardsPos(temp, typeFilter)
        : temp = filterCardsNeg(temp, typeFilter)
    }
    if (colorFilterPos !== undefined) {
      if (colorFilterPos.length > 0) {
        temp = temp.filter(card => card.color_identity.split("").some(color => colorFilterPos.includes(color)))
      }
      if (colorFilterNeg.length > 0) {
        temp = temp.filter(card => !card.color_identity.split("").some(color => colorFilterNeg.includes(color)))
      }
    }

    setCardsToDisplay(temp)
    const mainWithoutLands = main.filter(card => !card.types.includes("Land"))
    setCurveOfMain(Array.from({ length: maxManaValue + 1 }, (_, index) => mainWithoutLands.concat(commanders).filter(card => card.mana_value === index).length));
    const cardsToDisplayWithoutLands = temp.filter(card => !card.types.includes("Land"))
    setCurveOfDisplayed(Array.from({ length: maxManaValue + 1 }, (_, index) => cardsToDisplayWithoutLands.filter(card => showMain ? (main.includes(card)) : (side.includes(card))).filter(card => card.mana_value === index).length))

  }, [main, side, commanders, typeFilter, showDeckbuilder, colorFilterPos, colorFilterNeg, showMain])

  return (
    <>
      <div className={styles.deckStats}>
        <div className={styles.colorFilter}>
          <span className={styles.colorFilter}>
            {["W", "U", "B", "R", "G", "C"].map((color, index) => (
              <ColorFilter key={index} color={color} />
            ))}
          </span>
        </div>
        <div className={styles.typeFilter}>

          <TypeFilterObject name="Creatures" type="Pos" criteria={criteria.creature} deck={deck} all={all} />
          <TypeFilterObject name="Non-Creatures" type="Neg" criteria={criteria.nonCreature} deck={deck} all={all} />
          <TypeFilterObject name="Legendaries" type="Pos" criteria={criteria.legendaries} deck={deck} all={all} />
          <TypeFilterObject name="Planeswalkers" type="Pos" criteria={criteria.planeswalkers} deck={deck} all={all} />
          <TypeFilterObject name="Artifacts" type="Pos" criteria={criteria.artifacts} deck={deck} all={all} />
          <TypeFilterObject name="Enchantments" type="Pos" criteria={criteria.enchantments} deck={deck} all={all} />
          <TypeFilterObject name="Instants" type="Pos" criteria={criteria.instants} deck={deck} all={all} />
          <TypeFilterObject name="Sorceries" type="Pos" criteria={criteria.sorceries} deck={deck} all={all} />
          <TypeFilterObject name="Non-Basic Lands" type="Pos" criteria={criteria.lands} deck={deck} all={all} />
          <TypeFilterObject name="Auras" type="Pos" criteria={criteria.auras} deck={deck} all={all} />
          <TypeFilterObject name="Equipment" type="Pos" criteria={criteria.equipment} deck={deck} all={all} />
          <TypeFilterObject name="Sagas" type="Pos" criteria={criteria.sagas} deck={deck} all={all} />
          <TypeFilterObject name="Historics" type="Pos" criteria={criteria.historics} deck={deck} all={all} />
          <TypeFilterObject name="Permanents" type="Neg" criteria={criteria.permanents} deck={deck} all={all} />
          <TypeFilterObject name="Conspiracies" type="Pos" criteria={criteria.conspiracies} deck={deck} all={all} />
        </div>
        {(Array.isArray(curveOfMain) && Array.isArray(curveOfDisplayed) && curveOfMain.length > 0 && curveOfDisplayed.length > 0) && (
          (main.concat(commanders).concat(side).length > 2) ? (bars ? (
            <div className={styles.curveChart}>
              <Button name="Show lines" className="button" onClick={() => setBars(!bars)} />
              <BarChart
                dataset={dataset}
                xAxis={[{ scaleType: 'band', dataKey: 'manavalue', label: 'Mana Value' }]}
                series={[
                  { dataKey: "main", label: "Main", valueFormatter },
                  { dataKey: "displayed", label: "Displayed", valueFormatter }
                ]}
                width={500}
                height={300}
              />
            </div>
          ) : (
            <div className={styles.curveChart}>
              <Button name="Show bars" className="button" onClick={() => setBars(!bars)} />
              <LineChart
                xAxis={[{ data: manaValuesList, label: 'Mana Value' }]}
                series={[
                  { curve: "linear", data: curveOfMain, label: "Main" },
                  { curve: "linear", data: curveOfDisplayed, label: "Displayed" },
                ]}
                width={500}
                height={300}
              />
            </div>
          )) : null
        )}
      </div>
      <table className={styles.displayed}>
        <tbody>
          {cardsToDisplay.filter(card => showMain ? (main.includes(card)) : (side.includes(card))).reduce((rows, card, index) => {
            if (index % 5 === 0) rows.push([]); // Start a new row every 5 cards
            rows[rows.length - 1].push(
              <td key={index} className={selectedCards.includes(card) ? (styles.selected) : (styles.card)} onClick={() => selectCards(card)}>
                <Image imageUrl={card.image_url} backsideUrl={card.backside_image_url} />
              </td>
            );
            return rows;
          }, []).map((row, rowIndex) => (
            <tr key={rowIndex}>{row}</tr>
          ))}
        </tbody>
      </table>
    </>
  )
}


