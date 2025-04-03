import { Button, TextFilter, TwoThumbSlider } from "../../";
import { useState } from "react";

export const ColorId = ({ data, colorIdState }) => {
  const [colorId, setColorId] = useState("");
  const [oracleFilter, setOracleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [minManaValue, setMinManaValue] = useState(0);
  const [maxManaValue, setMaxManaValue] = useState(10);
  const colorIds = {
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

  const onClickColorId = (color) => {
    setColorId(color);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mt-6">{colorIdState}</h1>
      {data && (
        <>
          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <div className="flex flex-wrap gap-2">
              {colorIds[colorIdState]?.map((color) => (
                <Button
                  key={color}
                  title={color}
                  onClick={() => onClickColorId(color)}
                  modeType={colorId}
                  modeTarget={color}
                />
              ))}
            </div>
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
