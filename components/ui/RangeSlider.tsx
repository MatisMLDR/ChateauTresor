import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface RangeSliderProps {
  min: number;
  max: number;
  defaultValue?: [number, number];
  onValueChange?: (newValue: [number, number]) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  defaultValue = [min, max],
  onValueChange,
}) => {
  const [values, setValues] = useState<[number, number]>(defaultValue);

  const handleChange = (newValue: [number, number]) => {
    setValues(newValue);
    if (typeof onValueChange === 'function') {
      onValueChange(newValue);
    }
  };

  return (
    <div className="relative mt-2">
      <Slider.Root
        className="relative flex w-full touch-none select-none items-center"
        min={min}
        max={max}
        value={values}
        onValueChange={handleChange}
      >
        <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <Slider.Range className="absolute h-full bg-primary" />
        </Slider.Track>
        <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </Slider.Root>

      {/* Display current range */}
      <div className="mt-2 flex w-full justify-between text-sm text-muted-foreground">
        <span>Min: {values[0]}</span>
        <span>Max: {values[1]}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
