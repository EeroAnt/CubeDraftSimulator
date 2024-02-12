import { MyNavBar, Button, Image} from '../';
import { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

import './stats.css'


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

export const Stats = ({setMode}) => {
  return (
	<div className="main">
		<MyNavBar 
		  onClickDraftNavbar={() => setMode("Home")} 
		  onClickStatNavbar={() => setMode("Stats")}
		/>
	  <h1>Stats</h1>
	</div>
  )
}

export const DraftStats = ({
	main,
	side,
	commanders,
	showMain,
	selectedCards,
	selectCards,
	cardsToDisplay,
	typeFilter,
	setTypeFilter,
	curveOfMain,
	curveOfDisplayed
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

  const StatObject = ({name, type, criteria, deck, all}) => {
	const filterfunc = type==="Pos" ? amountOfFilteredCardsPos : amountOfFilteredCardsNeg
	if (filterfunc(deck, all, criteria) === "0/0") return null
	return (
	  <div className={selectedTypefilter===name ? ('current') : ('draftStatObject')} onClick={() => handleTypeFilter([type].concat(criteria), name)}>
		<h5>{name}</h5>
		  <p>{filterfunc(deck, all, criteria)}</p>
	  </div>
	)
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

  return (
	<>
	<div className='deckStats'>
	  <div className='draftStatContent'>
		<StatObject name="Creatures" type="Pos" criteria={criteria.creature} deck={deck} all={all}/>
		<StatObject name="Non-Creatures" type="Neg" criteria={criteria.nonCreature} deck={deck} all={all}/>
		<StatObject name="Legendaries" type="Pos" criteria={criteria.legendaries} deck={deck} all={all}/>
		<StatObject name="Planeswalkers" type="Pos" criteria={criteria.planeswalkers} deck={deck} all={all}/>
		<StatObject name="Artifacts" type="Pos" criteria={criteria.artifacts} deck={deck} all={all}/>
		<StatObject name="Enchantments" type="Pos" criteria={criteria.enchantments} deck={deck} all={all}/>
		<StatObject name="Instants" type="Pos" criteria={criteria.instants} deck={deck} all={all}/>
		<StatObject name="Sorceries" type="Pos" criteria={criteria.sorceries} deck={deck} all={all}/>
		<StatObject name="Lands" type="Pos" criteria={criteria.lands} deck={deck} all={all}/>
		<StatObject name="Auras" type="Pos" criteria={criteria.auras} deck={deck} all={all}/>
		<StatObject name="Equipment" type="Pos" criteria={criteria.equipment} deck={deck} all={all}/>
		<StatObject name="Sagas" type="Pos" criteria={criteria.sagas} deck={deck} all={all}/>
		<StatObject name="Historics" type="Pos" criteria={criteria.historics} deck={deck} all={all}/>
		<StatObject name="Permanents" type="Neg" criteria={criteria.permanents} deck={deck} all={all}/>
		<StatObject name="Conspiracies" type="Pos" criteria={criteria.conspiracies} deck={deck} all={all}/>
	  </div>
	  {(main.concat(commanders).concat(side).length > 2) ? ( bars ? (
	  <div className="curveChart">
		<Button name="Show lines" onClick={() => console.log(setBars(!bars))}/>

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
	  )) : (<Button name="test" onClick={() => console.log(dataset)}/>)}
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

