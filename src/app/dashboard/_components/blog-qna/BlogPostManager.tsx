"use client";

import CommonAlertDialog from "@/components/common/CommonAlertDialog";
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
  softTableCellClass,
  softTableHeadClass,
  softTableHeaderClass,
  softTableRowClass,
  softTableWrapperClass,
} from "@/lib/tableStyles";
import { cn } from "@/lib/utils";
import {
  useDeleteBlogPostMutation,
  useGetBlogPostsQuery,
} from "@/redux/features/blogQna/blogQnaApi";
import { TBlogPost } from "@/types/blog-qna";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  getListData,
  getMeta,
  getRefLabel,
  LocalPagination,
  SearchAndStatus,
  StatusBadge,
} from "./BlogQnaUtils";

export default function BlogPostManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const { data: response, isLoading } = useGetBlogPostsQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    ...(status !== "all" ? { status } : {}),
  });
  const posts = getListData<TBlogPost>(response);
  const meta = getMeta(response);
  const [deletePost] = useDeleteBlogPostMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deletePost(deleteId).unwrap();
      toast({
        className: "toast-success",
        title: res?.message || "Deleted successfully",
      });
      setDeleteId(null);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any)?.data?.message
          : "Delete failed";
      toast({ className: "toast-error", title: String(message) });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
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
        placeholder="Search blog posts…"
        statusOptions={["draft", "published", "archived"]}
      />

      <div className={softTableWrapperClass}>
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className={softTableHeaderClass}>
              <TableRow className="hover:bg-muted">
                <TableHead className={softTableHeadClass}>Title</TableHead>
                <TableHead className={softTableHeadClass}>Category</TableHead>
                <TableHead className={softTableHeadClass}>Topic</TableHead>
                <TableHead className={softTableHeadClass}>Views</TableHead>
                <TableHead className={softTableHeadClass}>
                  Published At
                </TableHead>
                <TableHead className={softTableHeadClass}>Status</TableHead>
                <TableHead className={cn(softTableHeadClass, "text-right")}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : posts.length ? (
                posts.map((post) => (
                  <TableRow key={post._id} className={softTableRowClass}>
                    <TableCell className={softTableCellClass}>
                      <div className="font-medium text-foreground">
                        {post.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {post.slug}
                      </div>
                    </TableCell>
                    <TableCell className={softTableCellClass}>
                      {getRefLabel(post.category)}
                    </TableCell>
                    <TableCell className={softTableCellClass}>
                      {getRefLabel(post.topic)}
                    </TableCell>
                    <TableCell className={softTableCellClass}>
                      {post.views || 0}
                    </TableCell>
                    <TableCell className={softTableCellClass}>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell className={softTableCellClass}>
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell className={softTableCellClass}>
                      <div className="flex justify-end gap-2">
                        <Button
                          asChild
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg"
                        >
                          <Link href={`/dashboard/blog-posts/${post._id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteId(post._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No blog posts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <LocalPagination
        page={page}
        totalPage={meta.totalPage}
        setPage={setPage}
        isLoading={isLoading}
      />

      <CommonAlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleDelete}
        loading={isDeleting}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
