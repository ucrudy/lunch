import {Slider} from "@heroui/react";
import { useAppContext } from "../AppContext";

const PriceSlider = () => {
  const { distance, setDistance } = useAppContext();

  return (
    <Slider
      classNames={{
        base: "max-w-xs",
        filler: "bg-gradient-to-r from-primary-500 to-secondary-400",
        labelWrapper: "mb-2",
        label: "font-medium text-default-700 text-medium",
        value: "font-medium text-default-500 text-small",
        thumb: [
          "transition-size",
          "bg-gradient-to-r from-secondary-400 to-primary-500",
          "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
          "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6",
        ],
      }}
      defaultValue={distance || 5}
      disableThumbScale={true}
      getValue={(miles) => `${miles} mi`}
      label="Max Distance"
      maxValue={10}
      minValue={1}
      onChange={(sliderValue) => {
        if (typeof sliderValue === "number") {
          setDistance(sliderValue);
        }
      }}
      step={1}
      size="sm"
    />
  );
};

export default PriceSlider;