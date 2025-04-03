import { Button } from "../../";
import { useState } from "react";

export const ColorId = ({ data, colorIdState }) => {
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

  const [colorId, setColorId] = useState("");
  const onClickColorId = (color) => {
    setColorId(color);
  }

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
          </div>
        </>
      )}
    </div>
  );
};
