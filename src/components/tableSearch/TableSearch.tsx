"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ChangeEvent } from "react";

type TableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const TableSearch = ({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: TableSearchProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("relative w-full sm:w-56", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-10 rounded-lg border-border bg-card pl-8 pr-3 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
      />
    </div>
  );
};

export default TableSearch;
