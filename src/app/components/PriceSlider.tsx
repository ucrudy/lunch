import {Slider} from "@heroui/react";
import { useAppContext } from "../AppContext";

const PriceSlider = () => {
    const { setPriceRange } = useAppContext();
  
  return (
    <Slider
      classNames={{
        base: "max-w-xs mt-[20px]",
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
        step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
      }}
      defaultValue={[1, 2]}
      disableThumbScale={true}
      hideValue={true}
      formatOptions={{style: "currency", currency: "USD"}}
      label="Price"
      marks={[
        {
          value: 1,
          label: "$",
        },
        {
          value: 2,
          label: "$$",
        },
        {
          value: 3,
          label: "$$$",
        },
        {
          value: 4,
          label: "$$$$",
        },
      ]}
      maxValue={4}
      minValue={1}
      onChange={(priceValue) => setPriceRange(Array.isArray(priceValue) ? priceValue : [priceValue])}
      showOutline={true}
      showSteps={true}
      showTooltip={false}
      step={1}
      size="sm"
    />
  );
};

export default PriceSlider;