import * as React from "react";
import { TCategories as TSubCategories } from "../../lib/category.interface";
import { CategoryTableBase } from "../../components/CategoryTableBase";
import { Input } from "@/components/ui/input";

export const SubCategoryTable = ({
  subcategories,
}: {
  subcategories: TSubCategories[];
}) => {
  const [globalFilter, setGlobalFilter] = React.useState("");

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 pt-1 pb-2">
        <Input
          placeholder="Filter Name..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs h-8 text-sm focus-visible:ring-primary"
        />
      </div>

      <CategoryTableBase
        data={subcategories}
        isSubCategory={true}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
};
