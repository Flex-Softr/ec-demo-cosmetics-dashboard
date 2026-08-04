import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { requireBlogAccess } from "@/app/dashboard/_components/blog-qna/BlogAccessGate";
import BlogPostForm from "@/app/dashboard/_components/blog-qna/BlogPostForm";

export default async function NewBlogPostPage() {
  await requireBlogAccess();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Create Blog Post"
        subtitle="Add a new blog article"
        icon={FileText}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
          >
            <Link href="/dashboard/blog-posts">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
        }
      />
      <ContentCard>
        <BlogPostForm />
      </ContentCard>
    </div>
  );
}
