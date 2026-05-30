import { Card } from "@/components/ui/card";
import { requireBlogAccess } from "@/app/dashboard/_components/blog-qna/BlogAccessGate";
import BlogPostForm from "@/app/dashboard/_components/blog-qna/BlogPostForm";

export default async function NewBlogPostPage() {
  await requireBlogAccess();

  return (
    <Card className="m-2 sm:m-4">
      <BlogPostForm />
    </Card>
  );
}
