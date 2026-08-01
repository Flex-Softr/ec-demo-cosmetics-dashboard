"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, X } from "lucide-react";
import { useMemo, useState } from "react";

export type MultiSelectOption = {
  label: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value?: MultiSelectOption[];
  onChange: (value: MultiSelectOption[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  renderOption?: (option: MultiSelectOption) => React.ReactNode;
  renderSelected?: (option: MultiSelectOption) => React.ReactNode;
};

const MultiSelect = ({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  className,
  disabled = false,
  searchable = true,
  renderOption,
  renderSelected,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedValues = useMemo(
    () => new Set(value.map((item) => String(item.value))),
    [value]
  );

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, search]);

  const toggleOption = (option: MultiSelectOption) => {
    const exists = selectedValues.has(String(option.value));
    if (exists) {
      onChange(
        value.filter((item) => String(item.value) !== String(option.value))
      );
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter((item) => String(item.value) !== optionValue));
  };

  return (
    <div className="w-full space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-10 w-full justify-between border-border bg-transparent px-3 font-normal text-foreground shadow-sm hover:bg-transparent",
              "focus-visible:border-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-muted-foreground/20",
              !value.length && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate">
              {value.length ? `${value.length} selected` : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          {searchable ? (
            <div className="border-b border-border p-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-9 border-border text-sm focus:border-muted-foreground/40 focus:ring-1 focus:ring-muted-foreground/20"
              />
            </div>
          ) : null}
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No options found.
              </p>
            ) : (
              filteredOptions.map((option) => {
                const checked = selectedValues.has(String(option.value));
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => toggleOption(option)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted",
                      checked && "bg-muted/60"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      className="pointer-events-none"
                    />
                    <span className="min-w-0 flex-1">
                      {renderOption ? renderOption(option) : option.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {value.map((option) => (
            <Badge
              key={String(option.value)}
              variant="outline"
              className="gap-1 border-border bg-muted/40 pr-1 font-normal text-foreground"
            >
              {renderSelected ? renderSelected(option) : option.label}
              <button
                type="button"
                onClick={() => removeOption(String(option.value))}
                className="rounded-sm p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={`Remove ${option.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelect;
