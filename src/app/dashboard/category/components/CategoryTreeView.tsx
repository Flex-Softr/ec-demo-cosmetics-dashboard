"use client";

import { useDeleteCategoryMutation } from "@/redux/features/category/categoryApi";
import { TCategories } from "../lib/category.interface";
import {
  Folder,
  FolderTree,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type TreeProps = {
  items: TCategories[];
  level?: number;
  onEdit?: (cat: TCategories) => void;
};

export default function CategoryTreeView({
  items,
  level = 0,
  onEdit,
}: TreeProps) {
  if (!items || items.length === 0) return null;

  return (
    <ul className={`space-y-1 ${level > 0 ? "pl-4 mt-1 border-l" : ""}`}>
      {items.map((cat) => (
        <CategoryNode key={cat._id} cat={cat} level={level} onEdit={onEdit} />
      ))}
    </ul>
  );
}

function CategoryNode({
  cat,
  level,
  onEdit,
}: {
  cat: TCategories;
  level: number;
  onEdit?: (cat: TCategories) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const hasChildren = (cat.children?.length ?? 0) > 0;
  const productCount = cat.productCount ?? 0;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory([cat._id]).unwrap();
      } catch {
        // handled by RTK Query
      }
    }
  };

  const isLevelCapped = level >= 3;

  return (
    <li className="list-none">
      <div
        className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-accent cursor-pointer group transition-colors"
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )
          ) : (
            <span className="w-4 h-4 shrink-0" />
          )}

          {hasChildren ? (
            <FolderTree className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
          )}

          <span className="text-sm font-medium truncate">{cat.name}</span>
          <span className="text-[11px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
            {productCount}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(cat);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {hasChildren && expanded && !isLevelCapped && (
        <CategoryTreeView
          items={cat.children!}
          level={level + 1}
          onEdit={onEdit}
        />
      )}
    </li>
  );
}
