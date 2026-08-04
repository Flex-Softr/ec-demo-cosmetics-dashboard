import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { requireBlogAccess } from "../_components/blog-qna/BlogAccessGate";
import BlogPostManager from "../_components/blog-qna/BlogPostManager";

export default async function BlogPostsPage() {
  await requireBlogAccess();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Blog Posts"
        subtitle="Create and manage blog articles"
        icon={FileText}
        actions={
          <Button asChild size="sm" className="rounded-lg gap-1.5">
            <Link href="/dashboard/blog-posts/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          </Button>
        }
      />
      <ContentCard>
        <BlogPostManager />
      </ContentCard>
    </div>
  );
}
