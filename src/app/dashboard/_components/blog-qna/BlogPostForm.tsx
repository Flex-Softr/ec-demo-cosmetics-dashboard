"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { revalidateTag } from "@/utilities/revalidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import ImageSelectPopup from "@/components/uploader/ImageSelectPopup";
import {
  useCreateBlogPostMutation,
  useGetBlogPostQuery,
  useGetBlogPostsQuery,
  useGetBlogQaCategoriesQuery,
  useGetBlogQaTagsQuery,
  useGetBlogQaTopicsQuery,
  useUpdateBlogPostMutation,
} from "@/redux/features/blogQna/blogQnaApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TBlogPost, TBlogPostPayload, TBlogStatus } from "@/types/blog-qna";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatImageSrc } from "@/lib/utils";
import { useGetSingleImageQuery } from "@/redux/features/addProduct/media/mediaApi";
import { getListData, getRefId, RichTextEditor, slugify } from "./BlogQnaUtils";
import RelatedBlogs from "./RelatedBlogs";
import TagsSelect from "./TagsSelect";
import { SeoControlled } from "@/components/Seo";

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  readTime: "5",
  category: "",
  tags: [] as string[],
  topic: "",
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
  const { data: topicResponse } = useGetBlogQaTopicsQuery({
    limit: 1000,
    status: "active",
  });

  const [imageOpen, setImageOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isNew = !postId;
  const blogPost = initialData ?? blogPostResponse?.data;
  const isLoading = isCreating || isUpdating;

  const categories = getListData<{ _id: string; name: string }>(
    categoryResponse
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topics = getListData<{ _id: string; name: string; category?: any }>(
    topicResponse
  );
  const tags = getListData<{ _id: string; name: string }>(tagResponse);
  const posts = getListData<TBlogPost>(postResponse).filter(
    (post) => post._id !== blogPost?._id
  );

  const { data: thumbnailImage } = useGetSingleImageQuery(
    form.featuredImage || undefined
  );

  const filteredTopics = topics.filter((topic) => {
    if (!form.category) return false;
    const topicCategoryId =
      typeof topic.category === "string" ? topic.category : topic.category?._id;
    return topicCategoryId === form.category;
  });

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
          topic: getRefId(blogPost.topic),
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
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "title" && !blogPost ? { slug: slugify(String(value)) } : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!form.title?.trim()) newErrors.title = "Title is required";
    if (!form.slug?.trim()) newErrors.slug = "Slug is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.topic) newErrors.topic = "Topic is required";
    if (!form.content?.trim()) newErrors.content = "Content is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        variant: "destructive",
        title: "Validation failed. Please check the form.",
      });
      return;
    }

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
      topic: form.topic,
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
      const apiErrors = (
        error as {
          data?: { errorMessages?: Array<{ path: string; message: string }> };
        }
      )?.data?.errorMessages;
      if (apiErrors && Array.isArray(apiErrors)) {
        const errorObj: Record<string, string> = {};
        apiErrors.forEach((err) => {
          errorObj[err.path] = err.message;
        });
        setErrors(errorObj);
      }

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
    <div className="space-y-4 pb-6">
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
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            <span>Title</span>
            <Input
              value={form.title}
              onChange={(event) => setValue("title", event.target.value)}
              placeholder="Enter blog post title"
              required
              className={
                errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Slug</span>
            <Input
              value={form.slug}
              onChange={(event) => setValue("slug", event.target.value)}
              placeholder="enter-blog-post-slug"
              required
              className={
                errors.slug ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
            )}
          </label>

          <SelectField
            label="Category"
            value={form.category}
            onChange={(value) => {
              setValue("category", value);
              setValue("topic", "");
            }}
            options={categories.map((item) => ({
              value: item._id,
              label: item.name,
            }))}
            placeholder="Select a category"
            error={errors.category}
          />
          <SelectField
            label="Topic"
            value={form.topic}
            onChange={(value) => setValue("topic", value)}
            options={filteredTopics.map((item) => ({
              value: item._id,
              label: item.name,
            }))}
            disabled={!form.category}
            placeholder={
              form.category ? "Select a topic" : "Select Category first"
            }
            error={errors.topic}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:col-span-2">
            <label className="space-y-2 text-sm font-medium">
              <span>Read time</span>
              <Input
                type="number"
                value={form.readTime}
                onChange={(event) => setValue("readTime", event.target.value)}
                placeholder="e.g. 5"
              />
            </label>
            <SelectField
              label="Status"
              value={form.status}
              onChange={(value) => setValue("status", value)}
              options={["draft", "published", "archived"]}
              placeholder="Select status"
              error={errors.status}
            />
            <label className="space-y-2 text-sm font-medium">
              <span>Published at</span>
              <Input
                type="datetime-local"
                value={form.publishedAt}
                onChange={(event) =>
                  setValue("publishedAt", event.target.value)
                }
              />
            </label>
          </div>
        </div>
        <div className="rounded-md border p-4 bg-card text-card-foreground shadow-sm">
          <div className="mb-3 text-sm font-semibold tracking-tight">
            Featured Image
          </div>
          {thumbnailImage?.data?.src && form.featuredImage ? (
            <div className="space-y-3">
              <div
                onClick={() => setImageOpen(true)}
                className="relative w-full max-w-sm aspect-video rounded-md border overflow-hidden cursor-pointer group bg-muted"
              >
                <Image
                  src={formatImageSrc(thumbnailImage.data.src)}
                  alt={thumbnailImage.data.alt || "Featured Image Preview"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 384px) 100vw, 384px"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-md">
                    Change Image
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setImageOpen(true)}
                >
                  Change Image
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setValue("featuredImage", "");
                    dispatch(setThumbnail(""));
                  }}
                >
                  Remove Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md bg-muted/40 hover:bg-muted/60 transition-colors">
              <ImageIcon className="h-10 w-10 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-muted-foreground mb-3">
                No image selected
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImageOpen(true)}
              >
                Select Image
              </Button>
            </div>
          )}
          <ImageSelectPopup
            open={imageOpen}
            click="thumbnail"
            handleOpen={setImageOpen}
            modalTitle="Select Featured Image"
            purpose="blog"
          />
        </div>
        <label className="space-y-2 text-sm font-medium">
          <span>Excerpt</span>
          <Textarea
            value={form.excerpt}
            onChange={(event) => setValue("excerpt", event.target.value)}
            placeholder="Provide a brief summary of the blog post..."
          />
        </label>

        <label className="space-y-2 text-sm font-medium">
          <span>Content</span>
          <RichTextEditor
            value={form.content}
            onBlur={(value: string) => setValue("content", value)}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content}</p>
          )}
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TagsSelect
            label="Tags"
            value={form.tags}
            onChange={(value) => setValue("tags", value)}
            options={tags.map((item) => ({ _id: item._id, name: item.name }))}
          />
          <RelatedBlogs
            label="Related blogs"
            value={form.relatedBlogs}
            onChange={(value) => setValue("relatedBlogs", value)}
            options={posts.map((item) => ({
              _id: item._id,
              label: item.title,
              thumb:
                typeof item.featuredImage === "object"
                  ? item.featuredImage?.src
                  : undefined,
            }))}
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

export function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label
      className={`space-y-2 text-sm font-medium ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer capitalize ${
          error ? "border-red-500 focus:ring-red-500" : "border-input"
        }`}
      >
        <option value="" disabled>
          {placeholder || `Select ${label}`}
        </option>
        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;
          const optionLabel =
            typeof option === "string" ? option : option.label;
          return (
            <option
              key={optionValue}
              value={optionValue}
              className="capitalize"
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </label>
  );
}

export default BlogPostForm;
