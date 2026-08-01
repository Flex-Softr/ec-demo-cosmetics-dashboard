"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BdAddress from "@/lib/bdAddress";
import {
  setSelectedDistrict,
  setSelectedDivision,
  setSelectedUpazila,
} from "@/redux/features/completedOrders/completedOrdersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ALL_VALUE = "all";

const FilterByDivisionDistrict = ({
  lang = "bn",
  showDivision = true,
}: {
  lang?: "bn" | "en";
  showDivision?: boolean;
}) => {
  const dispatch = useAppDispatch();

  const { selectedDivision, selectedDistrict, selectedUpazila } =
    useAppSelector(({ completedOrders }) => completedOrders);

  const divisions = BdAddress.divisions(lang);
  const districts = selectedDivision
    ? BdAddress.districts(selectedDivision, lang)
    : BdAddress.allDistricts();
  const upazilas = BdAddress.upazilas(selectedDistrict, lang);

  const districtPlaceholder = showDivision
    ? selectedDivision
      ? "Select District"
      : "Select Division First"
    : "Select District";

  const upazilaPlaceholder = selectedDistrict
    ? "Select Thana/Upazila"
    : "Select District First";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showDivision ? (
        <Select
          value={selectedDivision || ALL_VALUE}
          onValueChange={(value) => {
            dispatch(setSelectedDivision(value === ALL_VALUE ? "" : value));
            dispatch(setSelectedDistrict(""));
            dispatch(setSelectedUpazila(""));
          }}
        >
          <SelectTrigger className="h-10 w-44 rounded-lg">
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Divisions</SelectItem>
            {divisions.map(({ id, name }) => (
              <SelectItem key={id} value={String(id)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      <Select
        value={selectedDistrict || ALL_VALUE}
        onValueChange={(value) => {
          dispatch(setSelectedDistrict(value === ALL_VALUE ? "" : value));
          dispatch(setSelectedUpazila(""));
        }}
      >
        <SelectTrigger className="h-10 w-52 rounded-lg">
          <SelectValue placeholder={districtPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{districtPlaceholder}</SelectItem>
          {districts.map(({ id, name }) => (
            <SelectItem key={id} value={String(id)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedUpazila || ALL_VALUE}
        onValueChange={(value) =>
          dispatch(setSelectedUpazila(value === ALL_VALUE ? "" : value))
        }
        disabled={!selectedDistrict}
      >
        <SelectTrigger className="h-10 w-52 rounded-lg">
          <SelectValue placeholder={upazilaPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{upazilaPlaceholder}</SelectItem>
          {upazilas.map(({ id, name }) => (
            <SelectItem key={id} value={String(id)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterByDivisionDistrict;
