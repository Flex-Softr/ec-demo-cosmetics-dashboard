import { Card } from "@/components/ui/card";
import { requireBlogAccess } from "../_components/blog-qna/BlogAccessGate";
import BlogPostManager from "../_components/blog-qna/BlogPostManager";

export default async function BlogPostsPage() {
  await requireBlogAccess();

  return (
    <Card className="m-2 sm:m-4">
      <BlogPostManager />
    </Card>
  );
}
