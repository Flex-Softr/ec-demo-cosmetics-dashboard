"use client";

import { useEffect, useMemo, useState } from "react";
import { X, HelpCircle } from "lucide-react";
import Select, { components } from "react-select";

type RelatedQuestionOption = {
  _id: string;
  label: string;
};

type RelatedQuestionValue = { value: string; label: string };

export default function RelatedQuestions({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: Array<string | RelatedQuestionValue>;
  onChange: (val: string[]) => void;
  options: RelatedQuestionOption[];
}) {
  const [selected, setSelected] = useState<RelatedQuestionValue[]>([]);

  const keepIds = useMemo(
    () =>
      (value || []).filter((item): item is string => typeof item === "string"),
    [value]
  );
  const keepObjects = useMemo(
    () =>
      (value || []).filter(
        (item): item is RelatedQuestionValue =>
          typeof item === "object" && item !== null
      ),
    [value]
  );

  const questionOptions = useMemo(
    () =>
      options.map((opt) => ({
        value: opt._id,
        label: opt.label,
      })),
    [options]
  );

  useEffect(() => {
    const hydratedFromStrings = keepIds
      .map((id) => {
        const found = questionOptions.find((o) => o.value === id);
        return found ? { value: found.value, label: found.label } : undefined;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item): item is any => !!item) as RelatedQuestionValue[];

    const uniqueSelected = [...keepObjects, ...hydratedFromStrings].reduce<
      RelatedQuestionValue[]
    >((acc, item) => {
      if (!acc.some((existing) => existing.value === item.value)) {
        acc.push(item);
      }
      return acc;
    }, []);

    setSelected(uniqueSelected);
  }, [keepIds, keepObjects, questionOptions]);

  const updateSelected = (next: RelatedQuestionValue[]) => {
    setSelected(next);
    onChange(next.map((item) => item.value));
  };

  const remove = (valueToRemove: string) => {
    updateSelected(selected.filter((s) => s.value !== valueToRemove));
  };

  /** Custom option with icon */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Option = (props: any) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2 cursor-pointer">
        <HelpCircle className="h-5 w-5 text-muted-foreground/75" />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  /** Custom selected value pill */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MultiValueLabel = (props: any) => (
    <components.MultiValueLabel {...props}>
      <div className="flex items-center gap-1">
        <HelpCircle className="h-4 w-4 text-muted-foreground/75" />
        <span className="truncate max-w-[150px]">{props.data.label}</span>
      </div>
    </components.MultiValueLabel>
  );

  return (
    <div className="space-y-2 text-sm font-medium w-full">
      <span>{label}</span>

      <Select<RelatedQuestionValue, true>
        value={selected}
        isMulti
        isSearchable
        options={questionOptions}
        placeholder="Search questions..."
        className="react-select-container"
        classNamePrefix="react-select"
        components={{ Option, MultiValueLabel }}
        getOptionValue={(opt) => opt.value}
        getOptionLabel={(opt) => opt.label}
        onChange={(newValue) => updateSelected(Array.from(newValue))}
      />

      {selected.length > 0 && (
        <div className="space-y-3 mt-4">
          <p className="font-semibold text-sm">Selected questions</p>
          {selected.map((p) => (
            <div
              key={p.value}
              className="flex items-center justify-between gap-3 border-b pb-2"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="text-sm text-gray-400 dark:text-white">
                  {p.label}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  remove(p.value);
                }}
                type="button"
                className="cursor-pointer text-red-500 hover:text-red-600 text-lg"
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
