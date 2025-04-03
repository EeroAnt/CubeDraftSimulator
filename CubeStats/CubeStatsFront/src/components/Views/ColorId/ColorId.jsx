import { Button, TextFilter, TwoThumbSlider } from "../../";
import { useState, useEffect } from "react";

export const ColorId = ({ data, colorIdState }) => {
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
  const [colorIds, setColorIds] = useState(colorIdSets[colorIdState]);
  const [oracleFilter, setOracleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [minManaValue, setMinManaValue] = useState(0);
  const [maxManaValue, setMaxManaValue] = useState(20);

  const onClickColorId = (color) => {
    if (colorIds.includes(color)) {
      setColorIds(colorIds.filter((id) => id !== color));
    } else {
      setColorIds(colorIds.concat(color));
    }
  };

  useEffect(() => {
    setColorIds(colorIdSets[colorIdState]);
    setNameFilter("");
    setOracleFilter("");
    setTypeFilter("");
    setMinManaValue(0);
    setMaxManaValue(20);
  }, [colorIdState]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
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
              name="Mana Value"
              min={0}
              minValueSetter={setMinManaValue}
              max={20}
              maxValueSetter={setMaxManaValue}
            />
          </div>
        </>
      )}
    </div>
  );
};
