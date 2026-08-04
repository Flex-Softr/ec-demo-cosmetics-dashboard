"use client";

import CommonAlertDialog from "@/components/common/CommonAlertDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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
  useCreateBlogQaCategoryMutation,
  useCreateBlogQaTagMutation,
  useCreateBlogQaTopicMutation,
  useDeleteBlogQaCategoryMutation,
  useDeleteBlogQaTagMutation,
  useDeleteBlogQaTopicMutation,
  useGetBlogQaCategoriesQuery,
  useGetBlogQaTagsQuery,
  useGetBlogQaTopicsQuery,
  useUpdateBlogQaCategoryMutation,
  useUpdateBlogQaTagMutation,
  useUpdateBlogQaTopicMutation,
} from "@/redux/features/blogQna/blogQnaApi";
import {
  TBlogQACategory,
  TBlogQATag,
  TBlogQATopic,
  TBlogTaxonomyStatus,
} from "@/types/blog-qna";
import { revalidateTag } from "@/utilities/revalidate";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getListData,
  getMeta,
  LocalPagination,
  SearchAndStatus,
  slugify,
  StatusBadge,
} from "./BlogQnaUtils";
import { SelectField } from "./BlogPostForm";

type TKind = "category" | "tag" | "topic";
type TTaxonomyItem = TBlogQACategory | TBlogQATag | TBlogQATopic;

const emptyForm = {
  name: "",
  slug: "",
  category: "",
  description: "",
  status: "active" as TBlogTaxonomyStatus,
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  schemaMarkup: "",
};

const kindLabel = (kind: TKind) =>
  kind === "category" ? "Category" : kind === "tag" ? "Tag" : "Topic";

export default function BlogTaxonomyManager({ kind }: { kind: TKind }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const query = {
    page,
    limit: 10,
    search: debouncedSearch,
    ...(status !== "all" ? { status } : {}),
  };

  const categoryQuery = useGetBlogQaCategoriesQuery(query, {
    skip: kind !== "category",
  });
  const tagQuery = useGetBlogQaTagsQuery(query, { skip: kind !== "tag" });
  const topicQuery = useGetBlogQaTopicsQuery(query, { skip: kind !== "topic" });
  const response =
    kind === "category"
      ? categoryQuery.data
      : kind === "tag"
        ? tagQuery.data
        : topicQuery.data;
  const isLoading =
    kind === "category"
      ? categoryQuery.isLoading
      : kind === "tag"
        ? tagQuery.isLoading
        : topicQuery.isLoading;
  const items = getListData<TTaxonomyItem>(response);
  const meta = getMeta(response);

  const [deleteCategory] = useDeleteBlogQaCategoryMutation();
  const [deleteTag] = useDeleteBlogQaTagMutation();
  const [deleteTopic] = useDeleteBlogQaTopicMutation();

  const columnCount = kind === "topic" ? 6 : kind === "category" ? 5 : 4;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res =
        kind === "category"
          ? await deleteCategory(deleteId).unwrap()
          : kind === "tag"
            ? await deleteTag(deleteId).unwrap()
            : await deleteTopic(deleteId).unwrap();
      toast({
        className: "toast-success",
        title: res?.message || "Deleted successfully",
      });
      if (kind === "category") await revalidateTag("blogQaCategories");
      if (kind === "tag") await revalidateTag("blogQaTags");
      setDeleteId(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        className: "toast-error",
        title: error?.data?.message || "Delete failed",
      });
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
        placeholder={`Search ${kindLabel(kind).toLowerCase()}s…`}
        statusOptions={["active", "inactive"]}
      />

      <div className={softTableWrapperClass}>
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader className={softTableHeaderClass}>
              <TableRow className="hover:bg-muted">
                <TableHead className={softTableHeadClass}>Name</TableHead>
                <TableHead className={softTableHeadClass}>Slug</TableHead>
                {kind === "topic" && (
                  <TableHead className={softTableHeadClass}>Category</TableHead>
                )}
                {kind !== "tag" && (
                  <TableHead className={softTableHeadClass}>
                    Description
                  </TableHead>
                )}
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
                    colSpan={columnCount}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : items.length ? (
                items.map((item) => (
                  <TableRow key={item._id} className={softTableRowClass}>
                    <TableCell
                      className={cn(
                        softTableCellClass,
                        "font-medium text-foreground"
                      )}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      className={cn(
                        softTableCellClass,
                        "text-muted-foreground"
                      )}
                    >
                      {item.slug}
                    </TableCell>
                    {kind === "topic" &&
                      (() => {
                        const topicItem = item as TBlogQATopic;
                        const cat = topicItem.category;
                        return (
                          <TableCell className={softTableCellClass}>
                            {typeof cat === "object" && cat !== null
                              ? (cat as { name: string }).name
                              : cat || "-"}
                          </TableCell>
                        );
                      })()}
                    {kind !== "tag" && (
                      <TableCell
                        className={cn(
                          softTableCellClass,
                          "max-w-md truncate text-muted-foreground"
                        )}
                      >
                        {item.description || "-"}
                      </TableCell>
                    )}
                    <TableCell className={softTableCellClass}>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className={softTableCellClass}>
                      <div className="flex justify-end gap-2">
                        <TaxonomyForm
                          kind={kind}
                          initialData={item}
                          trigger={
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteId(item._id)}
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
                    colSpan={columnCount}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No data found.
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
        title={`Delete ${kindLabel(kind)}`}
        description={`Are you sure you want to delete this ${kind}? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={isDeleting}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}

export function TaxonomyForm({
  kind,
  initialData,
  trigger,
}: {
  kind: TKind;
  initialData?: TTaxonomyItem;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateBlogQaCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateBlogQaCategoryMutation();
  const [createTag, { isLoading: isCreatingTag }] =
    useCreateBlogQaTagMutation();
  const [updateTag, { isLoading: isUpdatingTag }] =
    useUpdateBlogQaTagMutation();
  const [createTopic, { isLoading: isCreatingTopic }] =
    useCreateBlogQaTopicMutation();
  const [updateTopic, { isLoading: isUpdatingTopic }] =
    useUpdateBlogQaTopicMutation();
  const { data: categoryResponse } = useGetBlogQaCategoriesQuery({
    limit: 1000,
    status: "active",
  });
  const categories = getListData<{ _id: string; name: string }>(
    categoryResponse
  );

  const isLoading =
    isCreatingCategory || isUpdatingCategory || isCreatingTag || isUpdatingTag;
  const isTopicLoading = isCreatingTopic || isUpdatingTopic;
  const overallLoading = isLoading || isTopicLoading;

  useEffect(() => {
    if (!open) return;
    setForm(
      initialData
        ? {
            name: initialData.name,
            slug: initialData.slug,
            category:
              "category" in initialData && initialData.category
                ? typeof initialData.category === "object"
                  ? (initialData.category as { _id: string })._id
                  : initialData.category
                : "",
            description: initialData.description || "",
            status: initialData.status,
            metaTitle:
              "seo" in initialData ? initialData.seo?.metaTitle || "" : "",
            metaDescription:
              "seo" in initialData
                ? initialData.seo?.metaDescription || ""
                : "",
            keywords:
              "seo" in initialData
                ? initialData.seo?.keywords?.join(", ") || ""
                : "",
            schemaMarkup:
              "seo" in initialData ? initialData.seo?.schemaMarkup || "" : "",
          }
        : emptyForm
    );
  }, [open, initialData]);

  const setValue = (key: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !initialData ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (kind === "topic" && !form.category) {
      toast({
        className: "toast-error",
        title: "Please select a category for this topic.",
      });
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
      status: form.status,
      ...(kind === "topic" ? { category: form.category } : {}),
      ...(kind === "category"
        ? {
            seo: {
              metaTitle: form.metaTitle || undefined,
              metaDescription: form.metaDescription || undefined,
              keywords: form.keywords
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              schemaMarkup: form.schemaMarkup || undefined,
            },
          }
        : {}),
    };

    try {
      const res = initialData
        ? kind === "category"
          ? await updateCategory({
              id: initialData._id,
              data: payload,
            }).unwrap()
          : kind === "tag"
            ? await updateTag({ id: initialData._id, data: payload }).unwrap()
            : await updateTopic({ id: initialData._id, data: payload }).unwrap()
        : kind === "category"
          ? await createCategory(payload).unwrap()
          : kind === "tag"
            ? await createTag(payload).unwrap()
            : await createTopic(payload).unwrap();
      toast({
        className: "toast-success",
        title: res?.message || "Saved successfully",
      });
      if (kind === "category") await revalidateTag("blogQaCategories");
      if (kind === "tag") await revalidateTag("blogQaTags");
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        className: "toast-error",
        title: error?.data?.message || "Save failed",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit" : "Add"} {kindLabel(kind)}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>Name</span>
              <Input
                value={form.name}
                onChange={(event) => setValue("name", event.target.value)}
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Slug</span>
              <Input
                value={form.slug}
                onChange={(event) => setValue("slug", event.target.value)}
                required
              />
            </label>
          </div>
          {kind !== "tag" && (
            <label className="space-y-2 text-sm font-medium">
              <span>Description</span>
              <Textarea
                value={form.description}
                onChange={(event) =>
                  setValue("description", event.target.value)
                }
              />
            </label>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
            {kind === "topic" && (
              <SelectField
                label="Category *"
                value={form.category}
                onChange={(value) => setValue("category", value)}
                options={categories.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))}
                placeholder="Select a category"
              />
            )}
            <div className={kind === "tag" ? "md:col-span-2" : ""}>
              <label className="space-y-2 text-sm font-medium">
                <span>Status</span>
                <Select
                  value={form.status}
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
          </div>
          {kind !== "tag" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                placeholder="Meta title"
                value={form.metaTitle}
                onChange={(event) => setValue("metaTitle", event.target.value)}
              />
              <Input
                placeholder="Keywords, comma separated"
                value={form.keywords}
                onChange={(event) => setValue("keywords", event.target.value)}
              />
              <Textarea
                className="md:col-span-2"
                placeholder="Meta description"
                value={form.metaDescription}
                onChange={(event) =>
                  setValue("metaDescription", event.target.value)
                }
              />
              <Textarea
                className="md:col-span-2"
                placeholder="Schema markup"
                value={form.schemaMarkup}
                onChange={(event) =>
                  setValue("schemaMarkup", event.target.value)
                }
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg"
              disabled={overallLoading}
            >
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
