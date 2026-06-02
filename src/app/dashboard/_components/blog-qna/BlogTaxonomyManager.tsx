"use client";

import { revalidateTag } from "@/utilities/revalidate";
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
  useCreateBlogQaCategoryMutation,
  useCreateBlogQaTagMutation,
  useDeleteBlogQaCategoryMutation,
  useDeleteBlogQaTagMutation,
  useGetBlogQaCategoriesQuery,
  useGetBlogQaTagsQuery,
  useUpdateBlogQaCategoryMutation,
  useUpdateBlogQaTagMutation,
  useGetBlogQaTopicsQuery,
  useCreateBlogQaTopicMutation,
  useUpdateBlogQaTopicMutation,
  useDeleteBlogQaTopicMutation,
} from "@/redux/features/blogQna/blogQnaApi";
import {
  TBlogQACategory,
  TBlogQATag,
  TBlogQATopic,
  TBlogTaxonomyStatus,
} from "@/types/blog-qna";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
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

export default function BlogTaxonomyManager({ kind }: { kind: TKind }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
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

  const title =
    kind === "category"
      ? "Blog & QnA Categories"
      : kind === "tag"
        ? "Blog & QnA Tags"
        : "Blog & QnA Topics";

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${kind}?`)) return;
    try {
      const res =
        kind === "category"
          ? await deleteCategory(id).unwrap()
          : kind === "tag"
            ? await deleteTag(id).unwrap()
            : await deleteTopic(id).unwrap();
      toast({
        className: "bg-success text-white",
        title: res?.message || "Deleted successfully",
      });
      if (kind === "category") await revalidateTag("blogQaCategories");
      if (kind === "tag") await revalidateTag("blogQaTags");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Delete failed",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <TaxonomyForm
          kind={kind}
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add{" "}
              {kind === "category"
                ? "Category"
                : kind === "tag"
                  ? "Tag"
                  : "Topic"}
            </Button>
          }
        />
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
        placeholder={`Search ${title.toLowerCase()}...`}
        statusOptions={["active", "inactive"]}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary text-white hover:bg-primary/90">
            <TableRow className="hover:bg-primary/90">
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              {kind === "topic" && <TableHead>Category</TableHead>}
              {kind !== "tag" && <TableHead>Description</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length ? (
              items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.slug}</TableCell>
                  {kind === "topic" &&
                    (() => {
                      const topicItem = item as TBlogQATopic;
                      const cat = topicItem.category;
                      return (
                        <TableCell>
                          {typeof cat === "object" && cat !== null
                            ? (cat as { name: string }).name
                            : cat || "-"}
                        </TableCell>
                      );
                    })()}
                  {kind !== "tag" && (
                    <TableCell className="max-w-md truncate">
                      {item.description || "-"}
                    </TableCell>
                  )}
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <TaxonomyForm
                        kind={kind}
                        initialData={item}
                        trigger={
                          <Button size="icon" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
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
                <TableCell colSpan={5} className="h-24 text-center">
                  No data found.
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

function TaxonomyForm({
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
  // include topic loading
  const isTopicLoading = isCreatingTopic || isUpdatingTopic;
  const overallLoading = isLoading || isTopicLoading;

  useEffect(() => {
    if (!open) return;
    setForm(
      initialData
        ? {
            name: initialData.name,
            slug: initialData.slug,
            // category only exists on TBlogQATopic — narrow with 'in' before accessing
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

    // Validate: category is required for topics
    if (kind === "topic" && !form.category) {
      toast({
        variant: "destructive",
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
        className: "bg-success text-white",
        title: res?.message || "Saved successfully",
      });
      if (kind === "category") await revalidateTag("blogQaCategories");
      if (kind === "tag") await revalidateTag("blogQaTags");
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
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
            {initialData ? "Edit" : "Add"}{" "}
            {kind === "category"
              ? "Category"
              : kind === "tag"
                ? "Tag"
                : "Topic"}
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={overallLoading}>
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
