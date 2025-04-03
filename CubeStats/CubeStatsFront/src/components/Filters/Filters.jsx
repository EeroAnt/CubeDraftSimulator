import "./Filters.css";
import React, { useState, useRef, useEffect } from "react";

export const TextFilter = ({ name, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 mb-4 flex-grow  ">
      <label className="text-gray-700 font-semibold">{name}</label>
      <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
      />
    </div>
  );
};

export const TwoThumbSlider = ({
  name,
  min,
  max,
  minValueSetter,
  maxValueSetter,
}) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);
  const trackRef = useRef(null);
  const rangeRef = useRef(null);

  useEffect(() => {
    updateRange();
  }, [minValue, maxValue]);

  const updateRange = () => {
    if (rangeRef.current) {
      const percentage1 = ((minValue - min) / (max - min)) * 100;
      const percentage2 = ((maxValue - min) / (max - min)) * 100;
      rangeRef.current.style.left = `${percentage1}%`;
      rangeRef.current.style.width = `${percentage2 - percentage1}%`;
    }
  };

  const handleMinChange = (e) => {
    const newMinVal = Math.min(parseInt(e.target.value), maxValue);
    setMinValue(newMinVal);
    minValueSetter(newMinVal);
  };

  const handleMaxChange = (e) => {
    const newMaxVal = Math.max(parseInt(e.target.value), minValue);
    setMaxValue(newMaxVal);
    maxValueSetter(newMaxVal);
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="mb-8">
        <h3 className="text-gray-700 font-semibold">
          {name}: {minValue} - {maxValue}
        </h3>

        <div className="relative h-2 mt-10">
          {/* Track background */}
          <div
            ref={trackRef}
            className="absolute w-full h-2 bg-gray-200 rounded-full"
          />

          {/* Selected range */}
          <div
            ref={rangeRef}
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{
              left: `${((minValue - min) / (max - min)) * 100}%`,
              width: `${((maxValue - min) / (max - min)) * 100 - ((minValue - min) / (max - min)) * 100}%`,
            }}
          />

          {/* Min thumb */}
          <input
            ref={minThumbRef}
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={handleMinChange}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none thumb-slider"
          />

          {/* Max thumb */}
          <input
            ref={maxThumbRef}
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={handleMaxChange}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none thumb-slider"
          />
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
