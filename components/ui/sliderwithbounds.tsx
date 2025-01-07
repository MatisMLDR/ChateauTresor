import { Slider } from './slider';
import {SliderWithBoundsProps} from "@/types";

export function SliderWithBounds({ max, min, step, className }: SliderWithBoundsProps) {

    return (
        <div className={`grid w-full max-w-sm items-center gap-1.5 ${className}`}>
            <Slider max={max} min={min} step={step} />
            <div className="flex justify-between">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
}
