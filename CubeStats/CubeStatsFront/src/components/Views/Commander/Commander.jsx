import { TextFilter, TwoThumbSlider, DraftedCardView } from "../../";
import { useState, useEffect } from "react";

export const Commander = ({ data }) => {
  const [cards, setCards] = useState([]);
  const unfilteredCards = data.cards.drafted_cards.filter(
    (card) => card.is_commander === "true",
  );
  const getMaxMV = (cards) => Math.max(...cards.map((card) => card.mv), 0);
  const getMinMV = (cards) => Math.min(...cards.map((card) => card.mv));

  const [oracleFilter, setOracleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [minManaValue, setMinManaValue] = useState(getMinMV(unfilteredCards));
  const [maxManaValue, setMaxManaValue] = useState(getMaxMV(unfilteredCards));
  const minDomainValue = getMinMV(unfilteredCards);
  const maxDomainValue = getMaxMV(unfilteredCards);

  useEffect(() => {
    const filteredCards = unfilteredCards.filter((card) => {
      const matchesName = card.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesOracle = card.oracle_text
        .toLowerCase()
        .includes(oracleFilter.toLowerCase());
      const matchesManaValue =
        card.mv >= minManaValue && card.mv <= maxManaValue;
      return matchesName && matchesOracle && matchesManaValue;
    });
    setCards(filteredCards);
  }, [unfilteredCards, nameFilter, oracleFilter, minManaValue, maxManaValue]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mt-6">Commanders</h1>
      {data && (
        <>
          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <div className="flex flex-row gap-4">
              <TextFilter
                name="Name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
              <TextFilter
                name="Text"
                value={oracleFilter}
                onChange={(e) => setOracleFilter(e.target.value)}
              />
            </div>
            <TwoThumbSlider
              name="Mana Value"
              min={minDomainValue}
              minValueSetter={setMinManaValue}
              max={maxDomainValue}
              maxValueSetter={setMaxManaValue}
            />
            <DraftedCardView cards={cards} sortKey={"avg_commander_pick"}/>
          </div>
        </>
      )}
    </div>
  );
};
