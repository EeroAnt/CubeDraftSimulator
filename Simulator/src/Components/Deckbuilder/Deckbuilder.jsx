import { Button, Image, ManaFilter } from '../';
import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

import './Deckbuilder.css'


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
	setCommanderColorIdentity,
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

  const TypeFilterObject = ({name, type, criteria, deck, all}) => {
	const filterfunc = type==="Pos" ? amountOfFilteredCardsPos : amountOfFilteredCardsNeg
	if (filterfunc(deck, all, criteria) === "0/0") return null
	return (
	  <div className={selectedTypefilter===name ? ('current') : ('typeFilterObject')} onClick={() => handleTypeFilter([type].concat(criteria), name)}>
		<h5>{name}</h5>
		  <p>{filterfunc(deck, all, criteria)}</p>
	  </div>
	)
  }

  const ColorFilter = ({ color }) => {
	if (colorFilterPos.includes(color)) {
	  return (	
		<ManaFilter className="Color-included" symbol={color} onClick={() => handleManaFilter(color)}/>
	)} else if (colorFilterNeg.includes(color)) {
	  return (
		<ManaFilter className="Color-excluded" symbol={color} onClick={() => handleManaFilter(color)}/>
	)} else {
	  return (
		<ManaFilter className="Color-neutral" symbol={color} onClick={() => handleManaFilter(color)}/>
	)}
  }


  const handleManaFilter = (color) => {
	console.log(color)
	// console.log(colorFilterPos.includes(color))
	if (!colorFilterPos.includes(color) && !colorFilterNeg.includes(color)) {
	  setColorFilterPos(colorFilterPos.concat(color))
	  console.log("Pos",colorFilterPos.concat(color))
	  console.log("Neg",colorFilterNeg)
	} else if (colorFilterPos.includes(color)) {
	  setColorFilterPos(colorFilterPos.filter(c => c !== color))
	  setColorFilterNeg(colorFilterNeg.concat(color))
	  console.log("Pos",colorFilterPos.filter(c => c !== color))
	  console.log("Neg",colorFilterNeg.concat(color))
	} else if (colorFilterNeg.includes(color)) {
	  setColorFilterNeg(colorFilterNeg.filter(c => c !== color))
	  console.log("Pos",colorFilterPos)
	  console.log("Neg",colorFilterNeg.filter(c => c !== color))
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
	if (commanders.length === 0) {
	  setCommanderColorIdentity(["C"])
	} else if (commanders.length === 1) {
	  setCommanderColorIdentity(commanders[0].color_identity.split(""))
	} else {
	  const combined = commanders[0].color_identity.split("").concat(commanders[1].color_identity.split(""))
	  const unique = [...new Set(combined)]
	  unique.length < 2 ? setCommanderColorIdentity(unique) : setCommanderColorIdentity(unique.filter(color => color !== "C"))
	}
	if (typeFilter[0] === "All") {
	  setCardsToDisplay(main.concat(side).concat(commanders))
	} else {
	  setCardsToDisplay(
		typeFilter[0] === "Pos" 
	  ? filterCardsPos(main.concat(side).concat(commanders), typeFilter)
	  : filterCardsNeg(main.concat(side).concat(commanders), typeFilter)
	)}
	const mainWithoutLands = main.filter(card => !card.types.includes("Land"))
	setCurveOfMain(Array.from({ length: maxManaValue + 1 }, (_, index) => mainWithoutLands.concat(commanders).filter(card => card.mana_value === index).length));
	const cardsToDisplayWithoutLands = cardsToDisplay.filter(card => !card.types.includes("Land"))
	setCurveOfDisplayed(Array.from({ length: maxManaValue + 1 }, (_, index) => cardsToDisplayWithoutLands.filter(card => showMain ? (main.includes(card)) : (side.includes(card))).filter(card => card.mana_value === index).length))

  }, [main, side, commanders, typeFilter, showDeckbuilder ])


  return (
	<>
	<div className='deckStats'>
	  <div className='colorFilter'>
	  <span className="colorFilter">
		{["W", "U", "B", "R", "G", "C"].map((color, index) => (
		  <ColorFilter key={index} color={color}/>
		))}
	  </span>
	  </div>
	  <div className='typeFilter'>

		<TypeFilterObject name="Creatures" type="Pos" criteria={criteria.creature} deck={deck} all={all}/>
		<TypeFilterObject name="Non-Creatures" type="Neg" criteria={criteria.nonCreature} deck={deck} all={all}/>
		<TypeFilterObject name="Legendaries" type="Pos" criteria={criteria.legendaries} deck={deck} all={all}/>
		<TypeFilterObject name="Planeswalkers" type="Pos" criteria={criteria.planeswalkers} deck={deck} all={all}/>
		<TypeFilterObject name="Artifacts" type="Pos" criteria={criteria.artifacts} deck={deck} all={all}/>
		<TypeFilterObject name="Enchantments" type="Pos" criteria={criteria.enchantments} deck={deck} all={all}/>
		<TypeFilterObject name="Instants" type="Pos" criteria={criteria.instants} deck={deck} all={all}/>
		<TypeFilterObject name="Sorceries" type="Pos" criteria={criteria.sorceries} deck={deck} all={all}/>
		<TypeFilterObject name="Lands" type="Pos" criteria={criteria.lands} deck={deck} all={all}/>
		<TypeFilterObject name="Auras" type="Pos" criteria={criteria.auras} deck={deck} all={all}/>
		<TypeFilterObject name="Equipment" type="Pos" criteria={criteria.equipment} deck={deck} all={all}/>
		<TypeFilterObject name="Sagas" type="Pos" criteria={criteria.sagas} deck={deck} all={all}/>
		<TypeFilterObject name="Historics" type="Pos" criteria={criteria.historics} deck={deck} all={all}/>
		<TypeFilterObject name="Permanents" type="Neg" criteria={criteria.permanents} deck={deck} all={all}/>
		<TypeFilterObject name="Conspiracies" type="Pos" criteria={criteria.conspiracies} deck={deck} all={all}/>
	  </div>
	  {(main.concat(commanders).concat(side).length > 2) ? ( bars ? (
	  <div className="curveChart">
		<Button name="Show lines" onClick={() => setBars(!bars)}/>

		<BarChart
		  dataset={dataset}
		  xAxis={[{ scaleType: 'band', dataKey: 'manavalue', label: 'Mana Value' }]}
		  series={[
			{ dataKey: "main", label: "Main", valueFormatter},
			{ dataKey: "displayed", label: "Displayed", valueFormatter}
		  ]}
		  width={500}
		  height={300}
		/>

	  </div>) : (
	  <div className="curveChart">
		<Button name="Show bars" onClick={() => console.log(setBars(!bars))}/>

		<LineChart
		  xAxis={[{ data: manaValuesList, label: 'Mana Value' }]}
  		  series={[
    		{ curve: "linear", data: curveOfMain, label: "Main"},
    		{ curve: "linear", data: curveOfDisplayed, label: "Displayed"},
  		  ]}
		  width={500}
		  height={300}
		/>
		
	  </div>
	  )) : (null)}
	</div>
	<table className="displayed">
      <tbody>
    	{cardsToDisplay.filter(card => showMain ? (main.includes(card)): (side.includes(card))).reduce((rows, card, index) => {
          if (index % 5 === 0) rows.push([]); // Start a new row every 5 cards
			rows[rows.length - 1].push(
			  <td key={index} className={selectedCards.includes(card) ? ("selected") : ("card")} onClick={() => selectCards(card)}>
                <Image imageUrl={card.image_url} backsideUrl={card.backside_image_url}/>
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

