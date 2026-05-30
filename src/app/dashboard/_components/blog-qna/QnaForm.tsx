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
import {
  useCreateQnAMutation,
  useGetBlogQaCategoriesQuery,
  useGetBlogQaTagsQuery,
  useGetQnAQuery,
  useGetQnAListQuery,
  useUpdateQnAMutation,
} from "@/redux/features/blogQna/blogQnaApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hooks";
import { TBlogStatus, TQnA, TQnAPayload } from "@/types/blog-qna";
import { useEffect, useMemo, useState } from "react";
import {
  getListData,
  getRefId,
  MultiSelect,
  RichTextEditor,
  slugify,
} from "./BlogQnaUtils";

const emptyForm = {
  question: "",
  slug: "",
  answer: "",
  category: "",
  tags: [] as string[],
  author: "",
  relatedQuestions: [] as string[],
  metaTitle: "",
  metaDescription: "",
  keywords: "",
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
  const { data: userResponse } = useGetAllUsersQuery({ limit: 1000 });

  const qnaData = initialData ?? qnaResponse?.data;
  const isLoading = isCreating || isUpdating;

  const categories = getListData<{ _id: string; name: string }>(
    categoryResponse
  );
  const tags = getListData<{ _id: string; name: string }>(tagResponse);
  const qnaItems = getListData<TQnA>(qnaListResponse).filter(
    (item) => item._id !== qnaData?._id
  );
  const users = getListData<{ _id: string; fullName?: string; email?: string }>(
    userResponse
  );

  const userOptions = useMemo(
    () =>
      users.map((item) => ({
        _id: item._id,
        label: item.fullName || item.email || item._id,
      })),
    [users]
  );

  useEffect(() => {
    if (qnaId && isFetchingQnA) return;

    setForm(
      qnaData
        ? {
            question: qnaData.question,
            slug: qnaData.slug,
            answer: qnaData.answer,
            category: getRefId(qnaData.category),
            tags: qnaData.tags?.map(getRefId).filter(Boolean) || [],
            author: getRefId(qnaData.author),
            relatedQuestions:
              qnaData.relatedQuestions?.map(getRefId).filter(Boolean) || [],
            metaTitle: qnaData.seo?.metaTitle || "",
            metaDescription: qnaData.seo?.metaDescription || "",
            keywords: qnaData.seo?.keywords?.join(", ") || "",
            schemaMarkup: qnaData.seo?.schemaMarkup || "",
            status: qnaData.status,
          }
        : { ...emptyForm, author: user?.userId || "" }
    );
  }, [qnaData, qnaId, isFetchingQnA, user?.userId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setValue = (key: keyof typeof emptyForm, value: any) => {
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

    const payload: TQnAPayload = {
      question: form.question,
      slug: form.slug,
      answer: form.answer,
      category: form.category,
      tags: form.tags,
      author: form.author,
      relatedQuestions: form.relatedQuestions,
      seo: {
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        keywords: form.keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        schemaMarkup: form.schemaMarkup || undefined,
      },
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
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any)?.data?.message
          : "Save failed";
      toast({ variant: "destructive", title: String(message) });
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {qnaData ? "Edit QnA" : "Add QnA"}
          </h1>
        </div>
        <Link href="/dashboard/qna">
          <Button variant="outline">Back to QnA</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium md:col-span-2">
            <span>Question</span>
            <Input
              value={form.question}
              onChange={(event) => setValue("question", event.target.value)}
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
        </div>

        <label className="space-y-2 text-sm font-medium">
          <span>Answer</span>
          <RichTextEditor
            value={form.answer}
            onBlur={(value: string) => setValue("answer", value)}
          />
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MultiSelect
            label="Tags"
            value={form.tags}
            onChange={(value) => setValue("tags", value)}
            options={tags.map((item) => ({ _id: item._id, label: item.name }))}
          />
          <MultiSelect
            label="Related questions"
            value={form.relatedQuestions}
            onChange={(value) => setValue("relatedQuestions", value)}
            options={qnaItems.map((item) => ({
              _id: item._id,
              label: item.question,
            }))}
          />
        </div>

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
            onChange={(event) => setValue("schemaMarkup", event.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Link href="/dashboard/qna">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
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

export default QnaForm;
