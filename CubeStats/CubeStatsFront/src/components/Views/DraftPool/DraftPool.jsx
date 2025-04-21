import { TextFilter, TwoThumbSlider, DraftedCardView, Button } from "../../";
import { matchesRegex } from "../../../utils/";
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
  const [colorIds, setColorIds] = useState(
    data.colors.picked_multicolor_color_ids,
  );
  const [unfilteredCards, setUnfilteredCards] = useState(
    data.cards.drafted_cards.filter(
      (card) => card.draft_pool === draftPools[draftPoolsState],
    ),
  );

  const colorIdSet = data.colors.picked_multicolor_color_ids;

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

  const onClickColorId = (color) => {
    if (colorIds.includes(color)) {
      setColorIds(colorIds.filter((id) => id !== color));
    } else {
      setColorIds(colorIds.concat(color));
    }
  };

  useEffect(() => {
    const newState = draftPoolsState;
    const newUnfilteredCards = data.cards.drafted_cards.filter((card) =>
      draftPools[newState].includes(card.draft_pool),
    );
    if (newState === "Multicolor") {
      setColorIds(colorIdSet);
    }
    setNameFilter("");
    setOracleFilter("");
    setTypeFilter("");
    setMinManaValue(0);
    setMaxManaValue(getMaxMV(newUnfilteredCards));
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
      const matchesOracle = matchesRegex(card.oracle_text, oracleFilter);
      const matchesType = matchesRegex(card.types, typeFilter);
      const matchesManaValue =
        card.mv >= minManaValue && card.mv <= maxManaValue;
      switch (draftPoolsState) {
        case "Multicolor":
          return (
            matchesName &&
            matchesOracle &&
            matchesType &&
            matchesManaValue &&
            colorIds.includes(card.color_identity)
          );
        default:
          return (
            matchesName && matchesOracle && matchesType && matchesManaValue
          );
      }
    });
    setCards(filteredCards);
  }, [
    unfilteredCards,
    nameFilter,
    oracleFilter,
    typeFilter,
    minManaValue,
    maxManaValue,
    colorIds,
  ]);

  return (
    <>
      <h1 className="text-4xl font-bold text-blue-600 mt-6">
        {draftPoolsState}
      </h1>
      {data && (
        <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
          {draftPoolsState === "Multicolor" && (
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
          )}
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
          <DraftedCardView cards={cards} sortKey={"avg_pick"} />
        </div>
      )}
    </>
  );
};
