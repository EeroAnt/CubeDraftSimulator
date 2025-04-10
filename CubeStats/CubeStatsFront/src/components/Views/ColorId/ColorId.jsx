import { Button, TextFilter, TwoThumbSlider, DraftedCardView } from "../../";
import { useState, useEffect } from "react";

export const ColorId = ({ data, colorIdState }) => {
  const [cards, setCards] = useState([]);
  const colorIdSets = {
    "Single Color": ["W", "U", "B", "R", "G", "C"],
    "Two Color": ["GW", "RU", "BR", "RW", "BG", "BW", "GU", "UW", "GR", "BU"],
    "Three Color": [
      "BGU",
      "GRW",
      "BGW",
      "RUW",
      "GRU",
      "BUW",
      "BRW",
      "BGR",
      "BRU",
      "GUW",
    ],
  };

  const getMaxMV = (cards) => Math.max(...cards.map(card => card.mv), 0);

  const [unfilteredCards, setUnfilteredCards] = useState(
    data?.cards.drafted_cards.filter((card) =>
      colorIdSets[colorIdState].includes(card.color_identity),
    ),
  );
  const [colorIds, setColorIds] = useState(colorIdSets[colorIdState]);
  const [oracleFilter, setOracleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [minManaValue, setMinManaValue] = useState(0);
  const [maxManaValue, setMaxManaValue] = useState(getMaxMV(unfilteredCards));
  const [maxDomainValue, setMaxDomainValue] = useState(
    getMaxMV(unfilteredCards),
  );

  const onClickColorId = (color) => {
    if (colorIds.includes(color)) {
      setColorIds(colorIds.filter((id) => id !== color));
    } else {
      setColorIds(colorIds.concat(color));
    }
  };

  useEffect(() => {
    const newState = colorIdState;
    const newUnfilteredCards = data.cards.drafted_cards.filter((card) =>
      colorIdSets[newState].includes(card.color_identity),
    );
    setColorIds(colorIdSets[newState]);
    setNameFilter("");
    setOracleFilter("");
    setTypeFilter("");
    setMinManaValue(0);
    setMaxManaValue(getMaxMV(newUnfilteredCards));
    setMaxDomainValue(getMaxMV(newUnfilteredCards));
    setUnfilteredCards(newUnfilteredCards);
  }, [colorIdState]);

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
      const matchesColorId = colorIds.includes(card.color_identity);
      return (
        matchesName &&
        matchesOracle &&
        matchesType &&
        matchesManaValue &&
        matchesColorId
      );
    });
    setCards(filteredCards);
  }, [
    nameFilter,
    oracleFilter,
    typeFilter,
    minManaValue,
    maxManaValue,
    unfilteredCards,
    colorIds,
  ]);

  return (
    <>
      <h1 className="text-4xl font-bold text-blue-600 mt-6">{colorIdState}</h1>
      {data && (
        <>
          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <div className="flex flex-wrap gap-2">
              {colorIdSets[colorIdState]?.map((color) => (
                <Button
                  key={color}
                  title={color}
                  onClick={() => onClickColorId(color)}
                  modeType={colorIds}
                  modeTarget={color}
                />
              ))}
            </div>
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
              <TextFilter
                name="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
            </div>
            <TwoThumbSlider
              key={colorIdState}
              name="Mana Value"
              min={0}
              minValueSetter={setMinManaValue}
              max={maxDomainValue}
              maxValueSetter={setMaxManaValue}
            />
            <DraftedCardView cards={cards} sortKey={"avg_pick"} />
          </div>
        </>
      )}
    </>
  );
};
