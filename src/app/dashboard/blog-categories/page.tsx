import { Card } from "@/components/ui/card";
import { requireBlogAccess } from "../_components/blog-qna/BlogAccessGate";
import BlogTaxonomyManager from "../_components/blog-qna/BlogTaxonomyManager";

export default async function BlogCategoriesPage() {
  await requireBlogAccess();

  return (
    <Card className="m-2 sm:m-4">
      <BlogTaxonomyManager kind="category" />
    </Card>
  );
}
