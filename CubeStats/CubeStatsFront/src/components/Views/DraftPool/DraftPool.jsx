import { TextFilter, TwoThumbSlider, CardView } from "../../";
import { useState, useEffect } from "react";

export const DraftPool = ({ data, draftPoolsState }) => {
  const draftPools = {
    Multicolor: "M",
    Land: "L",
    Colorless: "C",
    White: "W",
    Blue: "U",
    Black: "B",
    Red: "R",
    Green: "G",
  };
  const [unfilteredCards, setUnfilteredCards] = useState(
    data.cards.drafted_cards.filter(
      (card) => card.draft_pool === draftPools[draftPoolsState],
    ),
  );

  const getMaxMV = (cards) => Math.max(...cards.map((card) => card.mv), 0);

  const [cards, setCards] = useState([]);
  const [oracleFilter, setOracleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [minManaValue, setMinManaValue] = useState(0);
  const [maxManaValue, setMaxManaValue] = useState(getMaxMV(unfilteredCards));
  const [maxDomainValue, setMaxDomainValue] = useState(
    getMaxMV(unfilteredCards),
  );

  useEffect(() => {
    const newState = draftPoolsState;
    const newUnfilteredCards = data.cards.drafted_cards.filter((card) =>
      draftPools[newState].includes(card.draft_pool),
    );
    setNameFilter("");
    setOracleFilter("");
    setTypeFilter("");
    setMinManaValue(0);
    setMaxManaValue(getMaxMV(unfilteredCards));
    setMaxDomainValue(getMaxMV(newUnfilteredCards));
    setUnfilteredCards(
      data.cards.drafted_cards.filter(
        (card) => card.draft_pool === draftPools[draftPoolsState],
      ),
    );
  }, [draftPoolsState]);

  useEffect(() => {
    const filteredCards = unfilteredCards.filter((card) => {
      const matchesName = card.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesOracle = card.oracle_text
        .toLowerCase()
        .includes(oracleFilter.toLowerCase());
      const matchesType = card.types
        .toLowerCase()
        .includes(typeFilter.toLowerCase());
      const matchesManaValue =
        card.mv >= minManaValue && card.mv <= maxManaValue;
      return matchesName && matchesOracle && matchesType && matchesManaValue;
    });
    setCards(filteredCards);
  }, [
    unfilteredCards,
    nameFilter,
    oracleFilter,
    typeFilter,
    minManaValue,
    maxManaValue,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mt-6">
        {draftPoolsState}
      </h1>
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
              {draftPoolsState !== "Land" && (
                <TextFilter
                  name="Type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                />
              )}
            </div>
            {draftPoolsState !== "Land" && (
              <TwoThumbSlider
                name="Mana Value"
                min={0}
                minValueSetter={setMinManaValue}
                max={maxDomainValue}
                maxValueSetter={setMaxManaValue}
              />
            )}
            <CardView cards={cards} />
          </div>
        </>
      )}
    </div>
  );
};
