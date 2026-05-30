import { Card } from "@/components/ui/card";
import BlogPostForm from "@/app/dashboard/_components/blog-qna/BlogPostForm";
import { requireBlogAccess } from "@/app/dashboard/_components/blog-qna/BlogAccessGate";

const EditBlogPostPage = async ({ params }: { params: { id: string } }) => {
  await requireBlogAccess();

  return (
    <Card className="m-2 sm:m-4">
      <BlogPostForm postId={params.id} />
    </Card>
  );
};

export default EditBlogPostPage;
