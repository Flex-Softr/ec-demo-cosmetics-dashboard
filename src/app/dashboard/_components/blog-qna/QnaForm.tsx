"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { revalidateTag } from "@/utilities/revalidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateQnAMutation,
  useGetBlogQaCategoriesQuery,
  useGetBlogQaTagsQuery,
  useGetQnAQuery,
  useGetQnAListQuery,
  useUpdateQnAMutation,
  useGetBlogQaTopicsQuery,
} from "@/redux/features/blogQna/blogQnaApi";
import { useAppSelector } from "@/redux/hooks";
import { TBlogStatus, TQnA, TQnAPayload } from "@/types/blog-qna";
import { useEffect, useState } from "react";
import { getListData, getRefId, RichTextEditor, slugify } from "./BlogQnaUtils";
import { SeoControlled } from "@/components/Seo";
import RelatedQuestions from "./RelatedQuestions";
import TagsSelect from "./TagsSelect";

const emptyForm = {
  question: "",
  slug: "",
  answer: "",
  category: "",
  topic: "",
  tags: [] as string[],
  relatedQuestions: [] as string[],
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
  schemaMarkup: "",
  status: "draft" as TBlogStatus,
};

type QnaFormProps = {
  qnaId?: string;
  initialData?: TQnA;
};

const QnaForm = ({ qnaId, initialData }: QnaFormProps) => {
  const router = useRouter();
  const { user } = useAppSelector(({ auth }) => auth);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: qnaResponse, isLoading: isFetchingQnA } = useGetQnAQuery(
    qnaId as string,
    {
      skip: !qnaId,
    }
  );
  const [createQnA, { isLoading: isCreating }] = useCreateQnAMutation();
  const [updateQnA, { isLoading: isUpdating }] = useUpdateQnAMutation();
  const { data: categoryResponse } = useGetBlogQaCategoriesQuery({
    limit: 1000,
    status: "active",
  });
  const { data: tagResponse } = useGetBlogQaTagsQuery({
    limit: 1000,
    status: "active",
  });
  const { data: qnaListResponse } = useGetQnAListQuery({ limit: 1000 });
  const { data: topicResponse } = useGetBlogQaTopicsQuery({
    limit: 1000,
    status: "active",
  });

  const qnaData = initialData ?? qnaResponse?.data;
  const isLoading = isCreating || isUpdating;

  const categories = getListData<{ _id: string; name: string }>(
    categoryResponse
  );
  const tags = getListData<{ _id: string; name: string }>(tagResponse);
  const qnaItems = getListData<TQnA>(qnaListResponse).filter(
    (item) => item._id !== qnaData?._id
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topics = getListData<{ _id: string; name: string; category?: any }>(
    topicResponse
  );

  const filteredTopics = topics.filter((topic) => {
    if (!form.category) return false;
    const topicCategoryId =
      typeof topic.category === "string" ? topic.category : topic.category?._id;
    return topicCategoryId === form.category;
  });

  useEffect(() => {
    if (qnaId && isFetchingQnA) return;

    setForm(
      qnaData
        ? {
            question: qnaData.question,
            slug: qnaData.slug,
            answer: qnaData.answer,
            category: getRefId(qnaData.category),
            topic: getRefId(qnaData.topic),
            tags: qnaData.tags?.map(getRefId).filter(Boolean) || [],
            relatedQuestions:
              qnaData.relatedQuestions?.map(getRefId).filter(Boolean) || [],
            metaTitle: qnaData.seo?.metaTitle || "",
            metaDescription: qnaData.seo?.metaDescription || "",
            keywords: qnaData.seo?.keywords?.join(", ") || "",
            canonicalUrl: qnaData.seo?.canonicalUrl || "",
            schemaMarkup: qnaData.seo?.schemaMarkup || "",
            status: qnaData.status,
          }
        : { ...emptyForm }
    );
  }, [qnaData, qnaId, isFetchingQnA, user?.userId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setValue = (key: keyof typeof emptyForm, value: any) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "question" && !qnaData
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!form.question?.trim()) newErrors.question = "Question is required";
    if (!form.slug?.trim()) newErrors.slug = "Slug is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.topic) newErrors.topic = "Topic is required";
    if (!form.answer?.trim()) newErrors.answer = "Answer is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        variant: "destructive",
        title: "Validation failed. Please check the form.",
      });
      return;
    }

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

    const payload: TQnAPayload = {
      question: form.question,
      slug: form.slug,
      answer: form.answer,
      category: form.category,
      topic: form.topic,
      tags: form.tags,
      relatedQuestions: form.relatedQuestions,
      seo: buildSeo(),
      status: form.status,
    };

    try {
      const res = qnaData
        ? await updateQnA({ id: qnaData._id, data: payload }).unwrap()
        : await createQnA(payload).unwrap();

      toast({
        className: "bg-success text-white",
        title:
          res?.message ||
          (qnaData ? "Updated successfully" : "Created successfully"),
      });

      await revalidateTag(qnaData ? ["qna", `qna-${qnaData.slug}`] : ["qna"]);

      router.push("/dashboard/qna");
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

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium md:col-span-2">
            <span>Question</span>
            <Input
              value={form.question}
              onChange={(event) => setValue("question", event.target.value)}
              placeholder="Enter question"
              required
              className={
                errors.question
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.question && (
              <p className="text-red-500 text-xs mt-1">{errors.question}</p>
            )}
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Slug</span>
            <Input
              value={form.slug}
              onChange={(event) => setValue("slug", event.target.value)}
              placeholder="enter-question-slug"
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
            label="Status"
            value={form.status}
            onChange={(value) => setValue("status", value)}
            options={["draft", "published", "archived"]}
            placeholder="Select status"
            error={errors.status}
          />
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
        </div>

        <label className="space-y-2 text-sm font-medium">
          <span>Answer</span>
          <RichTextEditor
            value={form.answer}
            onBlur={(value: string) => setValue("answer", value)}
          />
          {errors.answer && (
            <p className="text-red-500 text-xs mt-1">{errors.answer}</p>
          )}
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TagsSelect
            label="Tags"
            value={form.tags}
            onChange={(value) => setValue("tags", value)}
            options={tags.map((item) => ({ _id: item._id, name: item.name }))}
          />
          <RelatedQuestions
            label="Related questions"
            value={form.relatedQuestions}
            onChange={(value) => setValue("relatedQuestions", value)}
            options={qnaItems.map((item) => ({
              _id: item._id,
              label: item.question,
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
          <Link href="/dashboard/qna">
            <Button type="button" variant="outline" className="rounded-lg">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="rounded-lg" disabled={isLoading}>
            {qnaData ? "Update" : "Create"}
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

export default QnaForm;
