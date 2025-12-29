import { Label } from "@/components/ui/label";
import {
  TSelectedAttribute,
  TSelectValue,
} from "@/redux/features/addProduct/variation/interface";
import {
  setSelectedAttribute,
  setSelectedAttributeValue,
} from "@/redux/features/addProduct/variation/variationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Select, { MultiValue } from "react-select";

const Attributes = ({ attributes }: { attributes: TSelectedAttribute[] }) => {
  const dispatch = useAppDispatch();
  const defaultAttribute = useAppSelector(
    ({ productVariation }) => productVariation.selectedAttribute
  );
  const defaultAttributeValue = useAppSelector(
    ({ productVariation }) => productVariation.selectedAttributeValue
  );

  const handleAttribute = (value: MultiValue<TSelectedAttribute>) => {
    const mutableValue: TSelectedAttribute[] = Array.from(value);
    dispatch(setSelectedAttribute(mutableValue));
  };

  const handleAttributeValue = (
    index: number,
    value: MultiValue<TSelectValue>
  ) => {
    const mutableValue: TSelectValue[] = Array.from(value);
    dispatch(setSelectedAttributeValue({ index, child: mutableValue }));
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>Select Attribute</Label>
        <Select
          defaultValue={defaultAttribute}
          isMulti
          isSearchable
          onChange={handleAttribute}
          options={attributes}
          placeholder="Select attribute..."
        />
      </div>
      {defaultAttribute.length > 0 &&
        defaultAttribute.map(({ label, child }, index) => (
          <div className="space-y-1" key={label}>
            <Label>Select {label}</Label>
            <Select
              isMulti
              isSearchable
              options={child?.map((item) => ({
                label: item.label,
                value: String(item.value),
              }))}
              defaultValue={defaultAttributeValue[index]?.child}
              onChange={(selectedOptions) =>
                handleAttributeValue(index, selectedOptions)
              }
              placeholder={`Select ${label}...`}
            />
          </div>
        ))}
    </div>
  );
};

export default Attributes;
