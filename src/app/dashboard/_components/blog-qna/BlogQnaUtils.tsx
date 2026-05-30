"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";

export const RichTextEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border p-4 text-sm">Loading editor...</div>
  ),
});

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getRefId = (value: unknown) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "_id" in value) {
    return String((value as { _id: string })._id);
  }
  return "";
};

export const getRefLabel = (value: unknown) => {
  if (!value) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const item = value as {
      name?: string;
      title?: string;
      question?: string;
      fullName?: string;
      email?: string;
      slug?: string;
    };
    return (
      item.name ||
      item.title ||
      item.question ||
      item.fullName ||
      item.email ||
      item.slug ||
      "-"
    );
  }
  return "-";
};

export const getListData = <T,>(response: unknown): T[] => {
  const res = response as { data?: { data?: T[] } | T[] } | undefined;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

export const getMeta = (response: unknown) => {
  const res = response as {
    data?: {
      meta?: {
        total?: number;
        totalPage?: number;
        totalPages?: number;
        page?: number;
        limit?: number;
      };
    };
  };
  const meta = res?.data?.meta;
  return {
    total: meta?.total || 0,
    totalPage: meta?.totalPage || meta?.totalPages || 1,
    page: meta?.page || 1,
    limit: meta?.limit || 10,
  };
};

export function StatusBadge({ status }: { status: string }) {
  const className =
    status === "published" || status === "active"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : status === "archived" || status === "inactive"
        ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
        : "bg-amber-100 text-amber-700 hover:bg-amber-100";

  return <Badge className={className}>{status}</Badge>;
}

export function SearchAndStatus({
  search,
  setSearch,
  status,
  setStatus,
  placeholder,
  statusOptions,
}: {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  placeholder: string;
  statusOptions: string[];
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
        className="md:max-w-sm"
      />
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          {statusOptions.map((item) => (
            <SelectItem key={item} value={item} className="capitalize">
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function LocalPagination({
  page,
  totalPage,
  setPage,
  isLoading,
}: {
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
  isLoading?: boolean;
}) {
  if (totalPage <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isLoading || page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPage}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isLoading || page >= totalPage}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export function MultiSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { _id: string; label: string }[];
}) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      <select
        multiple
        value={value}
        onChange={(event) =>
          onChange(
            Array.from(event.target.selectedOptions).map(
              (option) => option.value
            )
          )
        }
        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TagsPreview({ values }: { values?: unknown[] }) {
  if (!values?.length) return <span className="text-muted-foreground">-</span>;

  return (
    <div className="flex max-w-xs flex-wrap gap-1">
      {values.slice(0, 3).map((item, index) => (
        <Badge key={`${getRefId(item)}-${index}`} variant="outline">
          {getRefLabel(item)}
        </Badge>
      ))}
      {values.length > 3 && (
        <Badge variant="outline">+{values.length - 3}</Badge>
      )}
    </div>
  );
}
