import { formatDate, formatTime } from "@/lib/formatDate";
import { TCoupon } from "@/redux/features/coupon/couponInterface";
import { ColumnDef } from "@tanstack/react-table";
import { isAfter, isBefore, parseISO } from "date-fns";
import Action from "./Action";
import UpdateActiveStatus from "./UpdateActiveStatus";

const columns: ColumnDef<TCoupon>[] = [
  {
    id: "sl",
    header: "SL",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.original?.name}
      </span>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original?.code}</span>
    ),
  },
  {
    accessorKey: "usageCount",
    header: "Usage",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original?.usageCount}
      </span>
    ),
  },
  {
    accessorKey: "discountType",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize text-sm text-foreground">
        {row.original?.discountType}
      </span>
    ),
  },
  {
    accessorKey: "discountValue",
    header: "Value",
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {row.original?.discountValue || "—"}
      </span>
    ),
  },
  {
    accessorKey: "maxDiscountAmount",
    header: "Max",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original?.maxDiscount || "—"}
      </span>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="text-foreground">{formatTime(row.original?.startDate)}</p>
        <p className="text-muted-foreground">
          {formatDate(row.original?.startDate)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Ends",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="text-foreground">{formatTime(row.original?.endDate)}</p>
        <p className="text-muted-foreground">
          {formatDate(row.original?.endDate)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const startDate = row.original?.startDate
        ? parseISO(row.original.startDate)
        : null;
      const endDate = row.original?.endDate
        ? parseISO(row.original.endDate)
        : null;
      const currentDate = new Date();

      if (
        !startDate ||
        isNaN(startDate.getTime()) ||
        !endDate ||
        isNaN(endDate.getTime())
      ) {
        return (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Invalid date
          </span>
        );
      }

      let status = {
        label: "Active",
        className: "bg-emerald-50 text-emerald-700",
      };

      if (isBefore(currentDate, startDate)) {
        status = {
          label: "Not started",
          className: "bg-amber-50 text-amber-700",
        };
      } else if (isAfter(currentDate, endDate)) {
        status = {
          label: "Expired",
          className: "bg-red-50 text-red-700",
        };
      }

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <UpdateActiveStatus coupon={row.original} />,
  },
  {
    accessorKey: "action",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Action coupon={row.original} />
      </div>
    ),
  },
];

export default columns;
