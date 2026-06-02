"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteQnAMutation,
  useGetQnAListQuery,
} from "@/redux/features/blogQna/blogQnaApi";
import { TQnA } from "@/types/blog-qna";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  getListData,
  getMeta,
  getRefLabel,
  LocalPagination,
  SearchAndStatus,
  StatusBadge,
} from "./BlogQnaUtils";

export default function QnaManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const debouncedSearch = useDebounce(search, 500);
  const { data: response, isLoading } = useGetQnAListQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    ...(status !== "all" ? { status } : {}),
  });
  const qnaList = getListData<TQnA>(response);
  const meta = getMeta(response);
  const [deleteQnA] = useDeleteQnAMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this QnA?")) return;
    try {
      const res = await deleteQnA(id).unwrap();
      toast({
        className: "bg-success text-white",
        title: res?.message || "Deleted successfully",
      });
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any)?.data?.message
          : "Delete failed";
      toast({ variant: "destructive", title: String(message) });
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">QnA</h1>
        <Link href="/dashboard/qna/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add QnA
          </Button>
        </Link>
      </div>

      <SearchAndStatus
        search={search}
        setSearch={(value) => {
          setPage(1);
          setSearch(value);
        }}
        status={status}
        setStatus={(value) => {
          setPage(1);
          setStatus(value);
        }}
        placeholder="Search QnA..."
        statusOptions={["draft", "published", "archived"]}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary text-white hover:bg-primary/90">
            <TableRow className="hover:bg-primary/90">
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : qnaList.length ? (
              qnaList.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="font-medium">{item.question}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.slug}
                    </div>
                  </TableCell>
                  <TableCell>{getRefLabel(item.category)}</TableCell>
                  <TableCell>{getRefLabel(item.topic)}</TableCell>
                  <TableCell>{item.views || 0}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/qna/${item._id}/edit`}>
                        <Button size="icon" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No QnA found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <LocalPagination
        page={page}
        totalPage={meta.totalPage}
        setPage={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
