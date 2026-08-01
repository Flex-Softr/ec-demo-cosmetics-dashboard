import { cn } from "@/lib/utils";

/** Shared soft table header cell classes (BRmart-aligned). */
export const softTableHeadClass =
  "py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";

export const softTableHeaderClass = "bg-muted";

export const softTableWrapperClass =
  "overflow-hidden rounded-xl border border-border bg-card";

export const softTableRowClass =
  "group border-b border-border hover:bg-muted/70 transition-colors duration-100";

export const softTableCellClass = "py-3 text-left align-middle";

/** Soft status filter chip styles. */
export function statusChipClass(isActive: boolean) {
  return cn(
    "h-8 rounded-lg border capitalize gap-1.5 px-3 text-xs font-medium shadow-none",
    isActive
      ? "bg-primary/10 border-primary/30 text-primary"
      : "bg-card border-border text-foreground hover:bg-muted"
  );
}

/** Soft order status badge (BRmart-aligned). */
const ORDER_STATUS_SOFT: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  processing: "bg-primary/10 text-primary",
  "processing done": "bg-primary/10 text-primary",
  "follow up": "bg-cyan-100 text-cyan-800",
  "on courier": "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  completed: "bg-emerald-100 text-emerald-800",
  "partial delivered": "bg-blue-100 text-blue-800",
  cancelled: "bg-rose-100 text-rose-800",
  canceled: "bg-rose-100 text-rose-800",
  returned: "bg-rose-100 text-rose-800",
  deleted: "bg-rose-100 text-rose-800",
  hold: "bg-amber-100 text-amber-800",
  "warranty processing": "bg-orange-100 text-orange-800",
  "warranty added": "bg-cyan-100 text-cyan-800",
};

export function softOrderStatusClass(status: string) {
  return ORDER_STATUS_SOFT[status] || "bg-muted text-muted-foreground";
}

export function softBadgeClass(extra?: string) {
  return cn(
    "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
    extra
  );
}
