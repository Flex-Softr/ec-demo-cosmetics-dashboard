/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

import Select, { GroupBase, MultiValue } from "react-select";
import { TypographyH4 } from "../ui/Typography";

type OptionType = { value: string; label: string };

const tagOptions: readonly (OptionType | GroupBase<OptionType>)[] = [
  {
    label: "Tags",
    options: [
      { value: "Tag 1", label: "Tag 1" },
      { value: "Tag 2", label: "Tag 2" },
      { value: "Tag 3", label: "Tag 3" },
    ],
  },
  // Add more groups as needed
];

const MultiInput = ({
  heading,
  values,
}: {
  heading: string;
  values: string[];
}) => {
  const [selectedTags, setSelectedTags] = useState<
    MultiValue<string> | undefined
  >([]);

  const handleInputChange = (
    selectedOptions: MultiValue<string>
    // actionMeta: ActionMeta<string>
  ) => {
    // This function is called whenever the selection changes
    setSelectedTags(selectedOptions);
  };

  return (
    <div className="w-full flex items-center gap-2">
      <div className="w-fit">
        <TypographyH4>{heading}</TypographyH4>
      </div>

      <div className="w-full">
        <Select
          isMulti
          isSearchable
          value={selectedTags}
          onChange={handleInputChange}
          options={values}
          isClearable
        />
      </div>
    </div>
  );
};

export default MultiInput;
