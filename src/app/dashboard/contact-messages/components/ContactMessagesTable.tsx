"use client";

import { PagePagination } from "@/components/pagination/PagePagination";
import TableSearch from "@/components/tableSearch/TableSearch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteContactMessageMutation,
  useGetContactMessagesQuery,
  useUpdateContactMessageMutation,
} from "@/redux/features/contactMessage/contactMessageApi";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { Calendar, Info, Mail, Phone, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TContactMessage } from "./ContactMessagesColumn";
import { ContactMessagesTableBase } from "./ContactMessagesTableBase";

export default function ContactMessagesTable() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.pagination);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);

  const [selectedMessage, setSelectedMessage] =
    useState<TContactMessage | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | undefined> = {
      page,
      limit,
      sort: "-createdAt",
    };
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    return params;
  }, [page, limit, debouncedSearch]);

  const { data, isLoading, isFetching } =
    useGetContactMessagesQuery(queryParams);

  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();
  const [markAsRead] = useUpdateContactMessageMutation();

  const messages = data?.data || [];
  const meta = data?.meta;

  useEffect(() => {
    if (meta) {
      dispatch(setTotalPage({ total: meta.total, totalPage: meta.totalPage }));
    }
  }, [meta, dispatch]);

  useEffect(() => {
    dispatch(setIsLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (debouncedSearch) {
      dispatch(setPage(1));
    }
  }, [debouncedSearch, dispatch]);

  const handleView = async (message: TContactMessage) => {
    setSelectedMessage(message);
    setIsDetailsOpen(true);
    if (!message.isRead) {
      try {
        await markAsRead(message._id).unwrap();
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to mark message as read",
        });
      }
    }
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteMessage(deleteId).unwrap();
      toast({
        className: "toast-success",
        title: "Contact message deleted successfully",
      });
      setIsDeleteOpen(false);
      setDeleteId(null);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete message",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TableSearch
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search by name, email or subject…"
          className="sm:w-72"
        />
        <p className="text-sm text-muted-foreground">
          {meta?.total || 0} message{(meta?.total || 0) === 1 ? "" : "s"}
        </p>
      </div>

      <ContactMessagesTableBase
        data={messages}
        isLoading={isLoading}
        isFetching={isFetching}
        onView={handleView}
        onDelete={handleDeleteRequest}
        page={page}
        limit={limit}
      />

      <div className="flex items-center justify-end py-1">
        <PagePagination />
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Message Details
            </DialogTitle>
            <DialogDescription>
              Full contact message from the customer.
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-muted/30 p-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border border-border bg-card p-1.5">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        From
                      </p>
                      <p className="font-semibold text-foreground">
                        {selectedMessage.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border border-border bg-card p-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Received On
                      </p>
                      <p className="font-semibold text-foreground">
                        {format(
                          new Date(selectedMessage.createdAt),
                          "dd MMM yyyy, hh:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border border-border bg-card p-1.5">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Email Address
                      </p>
                      <p className="break-all font-semibold text-foreground">
                        {selectedMessage.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border border-border bg-card p-1.5">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="font-semibold text-foreground">
                        {selectedMessage.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Info className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Subject: {selectedMessage.subject}
                  </h3>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Message Content
                  </p>
                  <div className="min-h-[160px] whitespace-pre-wrap rounded-xl border border-border bg-muted/20 p-4 leading-relaxed text-foreground">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Message?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact message? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="rounded-lg">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-lg"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
