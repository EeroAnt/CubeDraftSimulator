import { useEffect, useState } from "react";
import { TextFilter, TwoThumbSlider, NotDraftedCardView, Button } from "../..";
import { matchesRegex } from "../../../utils";

export const AllCards = ({ data }) => {
  const unfilteredCards = data?.cards.cards_not_drafted.concat(
    data?.cards.drafted_cards,
  );
  const getMaxMV = (cards) => Math.max(...cards.map((card) => card.mv), 0);
  const [cards, setCards] = useState([]);
  const [oracleFilter, setOracleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [minManaValue, setMinManaValue] = useState(0);
  const [maxManaValue, setMaxManaValue] = useState(getMaxMV(unfilteredCards));
  const maxDomainValue = getMaxMV(unfilteredCards);
  const colorIdSet = data.colors.not_picked_color_ids;
  const [colorIds, setColorIds] = useState(colorIdSet);

  useEffect(() => {
    const filteredCards = unfilteredCards.filter((card) => {
      const matchesName = card.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesOracle = matchesRegex(card.oracle_text, oracleFilter);
      const matchesType = matchesRegex(card.types, typeFilter);
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
    colorIds,
  ]);
  const onClickColorId = (color) => {
    if (colorIds.includes(color)) {
      setColorIds(colorIds.filter((id) => id !== color));
    } else {
      setColorIds(colorIds.concat(color));
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-blue-600 mt-6">All Cards</h1>
      {data && (
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
            key={"ManaValueSlider"}
            name="Mana Value"
            min={0}
            minValueSetter={setMinManaValue}
            max={maxDomainValue}
            maxValueSetter={setMaxManaValue}
          />
          <NotDraftedCardView cards={cards} />
        </div>
      )}
    </>
  );
};
