import { DraftedCardView, Button } from "../../";
import { useState, useEffect } from "react";

export const Commander = ({ data }) => {
  const [cards, setCards] = useState([]);
  const unfilteredCards = data.cards.drafted_cards
    .concat(data.cards.cards_not_drafted)
    .filter((card) => card.is_commander === "true");
  const colorIdSet = data.colors.commander_color_ids;

  const [colorIds, setColorIds] = useState(colorIdSet);

  useEffect(() => {
    const filteredCards = unfilteredCards.filter((card) => {
      const matchesColorId = colorIds.includes(card.color_identity);
      return matchesColorId;
    });
    setCards(filteredCards);
  }, [colorIds]);

  const onClickColorId = (color) => {
    if (colorIds.includes(color)) {
      setColorIds(colorIds.filter((id) => id !== color));
    } else {
      setColorIds(colorIds.concat(color));
    }
  };

  const filterByColorId = (colorId) => {
    const filteredCards = unfilteredCards.filter((card) => {
      return card.color_identity === colorId;
    });
    return filteredCards;
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-blue-600 mt-6">Commanders</h1>
      {data && (
        <>
          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <div className="flex flex-wrap gap-2">
              {colorIdSet?.map((color) => (
                <Button
                  key={color}
                  title={color}
                  onClick={() => onClickColorId(color)}
                  modeType={colorIds}
                  modeTarget={color}
                />
              ))}
            </div>
            {colorIds.map((colorId) => (
              <div key={colorId} className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Color: {colorId}</h2>
                <DraftedCardView
                  cards={filterByColorId(colorId)}
                  sortKey="avg_commander_pick"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
