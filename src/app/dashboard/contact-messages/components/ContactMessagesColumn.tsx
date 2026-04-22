import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Eye, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
            className="w-2 h-2 rounded-full bg-primary animate-pulse"
            title="Unread"
          />
        )}
        <span className="font-medium text-muted-foreground">
          {(page - 1) * limit + row.index + 1}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex flex-col min-w-20">
        <span className="font-medium">
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
        <div className="flex items-center gap-1.5 font-semibold text-dark">
          <User className="w-3.5 h-3.5 text-primary" />
          <span>{row.original.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="w-3 h-3" />
          <span>{row.original.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="w-3 h-3" />
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
        className="max-w-[200px] font-medium truncate"
        title={row.original.subject}
      >
        {row.original.subject}
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message Snippet",
    cell: ({ row }) => (
      <div
        className="max-w-[250px] text-muted-foreground truncate"
        title={row.original.message}
      >
        {row.original.message}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 justify-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-primary/20 hover:border-primary hover:bg-primary/5 text-primary"
          onClick={() => onView(row.original)}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-destructive/20 hover:border-destructive hover:bg-destructive/5 text-destructive"
          onClick={() => onDelete(row.original._id)}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
