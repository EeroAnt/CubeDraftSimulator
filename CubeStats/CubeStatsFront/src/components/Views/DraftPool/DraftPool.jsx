import { TextFilter, TwoThumbSlider, CardView } from "../../";
import { useState, useEffect, use } from "react";

export const DraftPool = ({ data, draftPoolsState }) => {
  const [oracleFilter, setOracleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [minManaValue, setMinManaValue] = useState(0);
  const [maxManaValue, setMaxManaValue] = useState(20);

  useEffect(() => {
    setNameFilter("");
    setOracleFilter("");
    setTypeFilter("");
    setMinManaValue(0);
    setMaxManaValue(20);
  }, [draftPoolsState]);

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
                max={20}
                maxValueSetter={setMaxManaValue}
              />)}
              <CardView cards={data.cards} />
          </div>
        </>
      )}
    </div>
  );
};
