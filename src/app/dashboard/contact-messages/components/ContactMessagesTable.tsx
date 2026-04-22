"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useGetContactMessagesQuery,
  useDeleteContactMessageMutation,
  useUpdateContactMessageMutation,
} from "@/redux/features/contactMessage/contactMessageApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PagePagination } from "@/components/pagination/PagePagination";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setPage,
  setTotalPage,
  setIsLoading,
} from "@/redux/features/pagination/PaginationSlice";
import { format } from "date-fns";
import { TContactMessage } from "./ContactMessagesColumn";
import { ContactMessagesTableBase } from "./ContactMessagesTableBase";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Mail, Phone, Calendar, User, Info } from "lucide-react";

export default function ContactMessagesTable() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.pagination);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);

  const [selectedMessage, setSelectedMessage] =
    useState<TContactMessage | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  const [deleteMessage] = useDeleteContactMessageMutation();
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

  // Reset to page 1 when searching
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
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to mark message as read",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id).unwrap();
        toast({
          variant: "success",
          title: "Deleted",
          description: "Contact message deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete message",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-dark flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Messages ({meta?.total || 0})
        </h2>
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search by name, email or subject..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 focus-visible:ring-primary shadow-sm"
          />
        </div>
      </div>

      <ContactMessagesTableBase
        data={messages}
        isLoading={isLoading}
        isFetching={isFetching}
        onView={handleView}
        onDelete={handleDelete}
        page={page}
        limit={limit}
      />

      <div className="flex items-center justify-end py-2">
        <PagePagination />
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl gap-0 p-0 overflow-hidden border-none shadow-2xl overflow-y-auto">
          <DialogHeader className="bg-primary p-6 text-white">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Message Details
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="p-6 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-white rounded-md shadow-sm">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        From
                      </p>
                      <p className="font-semibold text-dark">
                        {selectedMessage.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-white rounded-md shadow-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Received On
                      </p>
                      <p className="font-semibold text-dark">
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
                    <div className="mt-1 p-1.5 bg-white rounded-md shadow-sm">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </p>
                      <p className="font-semibold text-dark break-all">
                        {selectedMessage.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-white rounded-md shadow-sm">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="font-semibold text-dark">
                        {selectedMessage.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Info className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-dark tracking-tight">
                    Subject: {selectedMessage.subject}
                  </h3>
                </div>

                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Message Content
                  </p>
                  <div className="p-5 bg-gray-50 rounded-xl text-dark leading-relaxed whitespace-pre-wrap min-h-[200px] border border-gray-100 shadow-inner">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
