"use client";
import BdAddress from "@/lib/bdAddress";
import {
  setSelectedDistrict,
  setSelectedDivision,
  setSelectedUpazila,
} from "@/redux/features/customers/customersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const FilterByDivisionDistrict = ({
  lang = "bn",
  showDivision = true,
}: {
  lang?: "bn" | "en";
  showDivision?: boolean;
}) => {
  const dispatch = useAppDispatch();

  const { selectedDivision, selectedDistrict, selectedUpazila } =
    useAppSelector(({ customers }) => customers);

  const divisions = BdAddress.divisions(lang);
  const districts = selectedDivision
    ? BdAddress.districts(selectedDivision, lang)
    : BdAddress.allDistricts();
  const upazilas = BdAddress.upazilas(selectedDistrict, lang);

  return (
    <div className="flex gap-5 items-center">
      {showDivision ? (
        <select
          onChange={(e) => dispatch(setSelectedDivision(e.target.value))}
          value={selectedDivision}
          className="w-44 h-9 border border-primary outline-primary rounded-md"
        >
          <option value="">-- Select Division --</option>
          {divisions.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      ) : null}
      <select
        onChange={(e) => dispatch(setSelectedDistrict(e.target.value))}
        value={selectedDistrict}
        className="w-52 h-9 border border-primary outline-primary rounded-md"
        // disabled={showDivision ? !selectedDivision : false}
      >
        <option value="">
          --{" "}
          {showDivision
            ? selectedDivision
              ? "Select District"
              : "Select Division First"
            : "Select District"}{" "}
          --
        </option>
        {districts.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => dispatch(setSelectedUpazila(e.target.value))}
        value={selectedUpazila}
        className="w-52 h-9 border border-primary outline-primary rounded-md"
        disabled={!selectedDistrict}
      >
        <option value="">
          -- {selectedDistrict ? "Select Upazila" : "Select District First"} --
        </option>
        {upazilas.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterByDivisionDistrict;
