"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { revalidateTag } from "@/utilities/revalidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import ImageSelectPopup from "@/components/uploader/ImageSelectPopup";
import {
  useCreateBlogPostMutation,
  useGetBlogPostQuery,
  useGetBlogPostsQuery,
  useGetBlogQaCategoriesQuery,
  useGetBlogQaTagsQuery,
  useUpdateBlogPostMutation,
} from "@/redux/features/blogQna/blogQnaApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TBlogPost, TBlogPostPayload, TBlogStatus } from "@/types/blog-qna";
import { ImageIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getListData,
  getRefId,
  MultiSelect,
  RichTextEditor,
  slugify,
} from "./BlogQnaUtils";
import RelatedBlogs from "./RelatedBlogs";
import { SeoControlled } from "@/components/Seo";

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  readTime: "5",
  category: "",
  tags: [] as string[],
  author: "",
  featuredImage: "",
  relatedBlogs: [] as Array<string | { value: string; label: string }>,
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
  schemaMarkup: "",
  status: "draft" as TBlogStatus,
  publishedAt: "",
};

type BlogPostFormProps = {
  postId?: string;
  initialData?: TBlogPost;
};

const BlogPostForm = ({ postId, initialData }: BlogPostFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);
  const { user } = useAppSelector(({ auth }) => auth);

  const { data: blogPostResponse, isLoading: isFetchingPost } =
    useGetBlogPostQuery(postId as string, { skip: !postId });
  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const { data: categoryResponse } = useGetBlogQaCategoriesQuery({
    limit: 1000,
    status: "active",
  });
  const { data: tagResponse } = useGetBlogQaTagsQuery({
    limit: 1000,
    status: "active",
  });
  const { data: postResponse } = useGetBlogPostsQuery({ limit: 1000 });
  const { data: userResponse } = useGetAllUsersQuery({ limit: 1000 });

  const [imageOpen, setImageOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const isNew = !postId;
  const blogPost = initialData ?? blogPostResponse?.data;
  const isLoading = isCreating || isUpdating;

  const categories = getListData<{ _id: string; name: string }>(
    categoryResponse
  );
  const tags = getListData<{ _id: string; name: string }>(tagResponse);
  const posts = getListData<TBlogPost>(postResponse).filter(
    (post) => post._id !== blogPost?._id
  );
  const users = getListData<{
    _id: string;
    fullName?: string;
    email?: string;
  }>(userResponse);

  const userOptions = useMemo(
    () =>
      users.map((item) => ({
        _id: item._id,
        label: item.fullName || item.email || item._id,
      })),
    [users]
  );

  useEffect(() => {
    if (postId && isFetchingPost) return;

    const currentImage = getRefId(blogPost?.featuredImage);
    const nextForm = blogPost
      ? {
          title: blogPost.title,
          slug: blogPost.slug,
          content: blogPost.content,
          excerpt: blogPost.excerpt || "",
          readTime: String(blogPost.readTime || 5),
          category: getRefId(blogPost.category),
          tags: blogPost.tags?.map(getRefId).filter(Boolean) || [],
          author: getRefId(blogPost.author),
          featuredImage: currentImage,
          relatedBlogs:
            blogPost.relatedBlogs?.map(getRefId).filter(Boolean) || [],
          metaTitle: blogPost.seo?.metaTitle || "",
          metaDescription: blogPost.seo?.metaDescription || "",
          keywords: blogPost.seo?.keywords?.join(", ") || "",
          canonicalUrl: blogPost.seo?.canonicalUrl || "",
          schemaMarkup: blogPost.seo?.schemaMarkup || "",
          status: blogPost.status,
          publishedAt: blogPost.publishedAt
            ? blogPost.publishedAt.slice(0, 16)
            : "",
        }
      : { ...emptyForm, author: user?.userId || "" };

    setForm(nextForm);
    dispatch(setThumbnail(currentImage));
  }, [postId, blogPost, dispatch, isFetchingPost, user?.userId]);

  useEffect(() => {
    if (thumbnail)
      setForm((current) => ({ ...current, featuredImage: thumbnail }));
  }, [thumbnail]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setValue = (key: keyof typeof emptyForm, value: any) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "title" && !blogPost ? { slug: slugify(String(value)) } : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // build seo only if any field is present to avoid sending `seo: undefined` to backend
    const buildSeo = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = {};
      if (form.metaTitle) obj.metaTitle = form.metaTitle;
      if (form.metaDescription) obj.metaDescription = form.metaDescription;
      const keywords = form.keywords
        ? String(form.keywords)
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : [];
      if (keywords.length) obj.keywords = keywords;
      if (form.canonicalUrl) obj.canonicalUrl = form.canonicalUrl;
      if (form.schemaMarkup) obj.schemaMarkup = form.schemaMarkup;
      return Object.keys(obj).length ? obj : undefined;
    };

    const payload: TBlogPostPayload = {
      title: form.title,
      slug: form.slug,
      content: form.content,
      excerpt: form.excerpt || undefined,
      readTime: Number(form.readTime) || 0,
      category: form.category,
      tags: form.tags,
      author: form.author,
      featuredImage: form.featuredImage || undefined,
      relatedBlogs: form.relatedBlogs.map((item) =>
        typeof item === "string" ? item : item.value
      ),
      seo: buildSeo(),
      status: form.status,
      publishedAt: form.publishedAt
        ? new Date(form.publishedAt).toISOString()
        : undefined,
    };

    try {
      const res = blogPost
        ? await updatePost({ id: blogPost._id, data: payload }).unwrap()
        : await createPost(payload).unwrap();

      toast({
        className: "bg-success text-white",
        title:
          res?.message ||
          (isNew ? "Created successfully" : "Updated successfully"),
      });

      await revalidateTag(
        blogPost ? ["blogPosts", `blogPost-${blogPost.slug}`] : ["blogPosts"]
      );

      router.push("/dashboard/blog-posts");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any)?.data?.message
          : "Save failed";

      toast({ variant: "destructive", title: String(message) });
    }
  };

  if (postId && isFetchingPost) {
    return <div className="p-6">Loading blog post details...</div>;
  }

  if (postId && !blogPost) {
    return <div className="p-6">Blog post not found.</div>;
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? "Add Blog Post" : "Edit Blog Post"}
          </h1>
        </div>
        <Link href="/dashboard/blog-posts">
          <Button variant="outline">Back to posts</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            <span>Title</span>
            <Input
              value={form.title}
              onChange={(event) => setValue("title", event.target.value)}
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
          <SelectField
            label="Status"
            value={form.status}
            onChange={(value) => setValue("status", value)}
            options={["draft", "published", "archived"]}
          />
          <SelectField
            label="Category"
            value={form.category}
            onChange={(value) => setValue("category", value)}
            options={categories.map((item) => ({
              value: item._id,
              label: item.name,
            }))}
          />
          <SelectField
            label="Author"
            value={form.author}
            onChange={(value) => setValue("author", value)}
            options={userOptions.map((item) => ({
              value: item._id,
              label: item.label,
            }))}
          />
          <label className="space-y-2 text-sm font-medium">
            <span>Read time</span>
            <Input
              type="number"
              value={form.readTime}
              onChange={(event) => setValue("readTime", event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Published at</span>
            <Input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(event) => setValue("publishedAt", event.target.value)}
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium">
          <span>Excerpt</span>
          <Textarea
            value={form.excerpt}
            onChange={(event) => setValue("excerpt", event.target.value)}
          />
        </label>

        <label className="space-y-2 text-sm font-medium">
          <span>Content</span>
          <RichTextEditor
            value={form.content}
            onBlur={(value: string) => setValue("content", value)}
          />
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MultiSelect
            label="Tags"
            value={form.tags}
            onChange={(value) => setValue("tags", value)}
            options={tags.map((item) => ({ _id: item._id, label: item.name }))}
          />
          <RelatedBlogs
            label="Related blogs"
            value={form.relatedBlogs}
            onChange={(value) => setValue("relatedBlogs", value)}
            options={posts.map((item) => ({
              _id: item._id,
              label: item.title,
            }))}
          />
        </div>

        <div className="rounded-md border p-3">
          <div className="mb-2 text-sm font-medium">Featured image</div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageOpen(true)}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Image
            </Button>
            <span className="text-sm text-muted-foreground">
              {form.featuredImage || "No image selected"}
            </span>
          </div>
          <ImageSelectPopup
            open={imageOpen}
            click="thumbnail"
            handleOpen={setImageOpen}
            modalTitle="Select Featured Image"
          />
        </div>

        <SeoControlled
          values={{
            metaTitle: form.metaTitle,
            keywords: form.keywords,
            canonicalUrl: form.canonicalUrl,
            metaDescription: form.metaDescription,
            schemaMarkup: form.schemaMarkup,
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(k: any, v: any) => setValue(k as any, v)}
        />

        <div className="flex justify-end gap-2">
          <Link href="/dashboard/blog-posts">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {blogPost ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
}) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;
            const optionLabel =
              typeof option === "string" ? option : option.label;
            return (
              <SelectItem
                key={optionValue}
                value={optionValue}
                className="capitalize"
              >
                {optionLabel}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </label>
  );
}

export default BlogPostForm;
