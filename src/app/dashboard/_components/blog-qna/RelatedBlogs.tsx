"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type RelatedPostOption = {
  _id: string;
  label: string;
};

type RelatedPostValue = { value: string; label: string };

export default function RelatedBlogs({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: Array<string | RelatedPostValue>;
  onChange: (val: string[]) => void;
  options: RelatedPostOption[];
}) {
  const [toAdd, setToAdd] = useState("");
  const [selected, setSelected] = useState<RelatedPostValue[]>([]);

  const keepIds = useMemo(
    () =>
      (value || []).filter((item): item is string => typeof item === "string"),
    [value]
  );
  const keepObjects = useMemo(
    () =>
      (value || []).filter(
        (item): item is RelatedPostValue =>
          typeof item === "object" && item !== null
      ),
    [value]
  );

  useEffect(() => {
    const hydratedFromStrings = keepIds
      .map((id) => {
        const found = options.find((o) => o._id === id);
        return found ? { value: found._id, label: found.label } : undefined;
      })
      .filter((item): item is RelatedPostValue => !!item);

    const uniqueSelected = [...keepObjects, ...hydratedFromStrings].reduce<
      RelatedPostValue[]
    >((acc, item) => {
      if (!acc.some((existing) => existing.value === item.value)) {
        acc.push(item);
      }
      return acc;
    }, []);

    setSelected(uniqueSelected);
  }, [keepIds, keepObjects, options]);

  const updateSelected = (next: RelatedPostValue[]) => {
    setSelected(next);
    onChange(next.map((item) => item.value));
  };

  const addSelected = () => {
    if (!toAdd) return;
    const found = options.find((o) => o._id === toAdd);
    if (!found) return;
    const obj = { value: found._id, label: found.label };
    if (selected.some((s) => s.value === obj.value)) return;
    updateSelected([...selected, obj]);
    setToAdd("");
  };

  const remove = (valueToRemove: string) => {
    updateSelected(selected.filter((s) => s.value !== valueToRemove));
  };

  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <select
          value={toAdd}
          onChange={(e) => setToAdd(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={addSelected} className="btn">
          Add
        </button>
      </div>

      {selected.length > 0 && (
        <div className="space-y-2 mt-3">
          {selected.map((p) => (
            <div
              key={p.value}
              className="flex items-center justify-between gap-3 border-b pb-2"
            >
              <div className="flex items-center gap-3">
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
    </label>
  );
}
