import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Mail, Phone, Trash2, User } from "lucide-react";

export type TContactMessage = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export const getColumns = (
  onView: (message: TContactMessage) => void,
  onDelete: (id: string) => void,
  page: number,
  limit: number
): ColumnDef<TContactMessage>[] => [
  {
    id: "sl",
    header: "SL",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        {!row.original.isRead && (
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-primary"
            title="Unread"
          />
        )}
        <span className="text-sm text-muted-foreground">
          {(page - 1) * limit + row.index + 1}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex min-w-20 flex-col">
        <span className="font-medium text-foreground">
          {format(new Date(row.original.createdAt), "dd MMM yyyy")}
        </span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.createdAt), "hh:mm a")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Sender Info",
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <User className="h-3.5 w-3.5 text-primary" />
          <span>{row.original.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span>{row.original.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span>{row.original.phone}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate font-medium text-foreground"
        title={row.original.subject}
      >
        {row.original.subject}
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div
        className="max-w-[250px] truncate text-muted-foreground"
        title={row.original.message}
      >
        {row.original.message}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
          onClick={() => onView(row.original)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(row.original._id)}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
