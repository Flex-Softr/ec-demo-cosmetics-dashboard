"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Select from "react-select";

type TagOption = { value: string; label: string };

export default function TagsSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  options: Array<{ _id: string; name: string }>;
}) {
  const [selected, setSelected] = useState<TagOption[]>([]);

  const tagOptions = useMemo<TagOption[]>(
    () => options.map((o) => ({ value: o._id, label: o.name })),
    [options]
  );

  // Hydrate IDs → label objects when options load or value changes
  useEffect(() => {
    const hydrated = (value || [])
      .map((id) => tagOptions.find((o) => o.value === id))
      .filter((o): o is TagOption => !!o);
    setSelected(hydrated);
  }, [value, tagOptions]);

  const updateSelected = (next: TagOption[]) => {
    setSelected(next);
    onChange(next.map((o) => o.value));
  };

  const remove = (id: string) =>
    updateSelected(selected.filter((s) => s.value !== id));

  return (
    <div className="space-y-2 text-sm font-medium w-full">
      <span>{label}</span>

      <Select<TagOption, true>
        value={selected}
        isMulti
        isSearchable
        options={tagOptions}
        placeholder="Search & select tags..."
        className="react-select-container"
        classNamePrefix="react-select"
        getOptionValue={(o) => o.value}
        getOptionLabel={(o) => o.label}
        onChange={(newValue) => updateSelected(Array.from(newValue))}
      />

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((tag) => (
            <span
              key={tag.value}
              className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs font-medium"
            >
              {tag.label}
              <button
                type="button"
                onClick={() => remove(tag.value)}
                className="cursor-pointer text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
