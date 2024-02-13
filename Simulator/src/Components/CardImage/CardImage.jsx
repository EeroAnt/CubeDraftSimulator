import React from 'react';
import { useState } from 'react';


export const Image = ({ imageUrl, backsideUrl }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  if (!backsideUrl) {
	return (
	  <>
		<img src={imageUrl} alt="Image" />
	  </>
	)
  }

  else {
	const imageClick = () => {
	  setIsFlipped(isFlipped => !isFlipped);
	}

	if (isFlipped === true) {
      return (
		<>
		  <img src={backsideUrl} alt="Image" onClick={() => imageClick()} />
		</>
	  )
	}

	else {
	  return (
		<>
		  <img src={imageUrl} alt="Image" onClick={() => imageClick()} />
		</>
	  )
    }
  }
}


export const ManaSymbol = ({ symbol }) => {
  return (
	<>
	   <img src={`https://svgs.scryfall.io/card-symbols/${symbol}.svg`} alt="Mana Symbol" />
	</>
  )
}

export const ManaFilter = ({ symbol, onClick, className }) => {
	return (
	  <>
		 <img className={className} src={`https://svgs.scryfall.io/card-symbols/${symbol}.svg`} alt="Mana Symbol" onClick={onClick}/>
	  </>
	)
  }