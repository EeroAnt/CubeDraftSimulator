import { NavBar, Button} from '../';
import { useState } from 'react';

function filterCards(cards, type) {
  return cards.filter(card => card.types.includes(type))
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

export const Stats = ({setMode}) => {
  return (
	<div className="main">
		<NavBar 
		  onClickDraftNavbar={() => setMode("Home")} 
		  onClickStatNavbar={() => setMode("Stats")}
		/>
	  <h1>Stats</h1>
	</div>
  )
}

export const DraftStats = ({main, side, commanders}) => {
  const all = main.concat(side).concat(commanders)
  const deck = main.concat(commanders)
  const creatures = amountOfFilteredCardsPos(deck, all, ["Creature"])
  const nonCreatures = amountOfFilteredCardsNeg(deck, all, ["Creature", "Land"])
  const criteriaPos = {
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
	historics: ["Artifact", "Legendary", "Saga"]
	}
  const criteriaNeg = {
	nonCreature: ["Creature", "Land"],
	permanents: ["Instant", "Sorcery"]
  }
  return (
	<div>
	  <h2>Main</h2>
		<Button name="Testify" onClick={() => console.log(creatures)}/>
		<Button name="Test2ify" onClick={() => console.log(nonCreatures)}/>
	</div>
  )
}
