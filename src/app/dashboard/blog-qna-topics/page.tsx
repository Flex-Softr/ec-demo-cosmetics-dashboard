import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Hash, Plus } from "lucide-react";
import { requireBlogAccess } from "../_components/blog-qna/BlogAccessGate";
import BlogTaxonomyManager, {
  TaxonomyForm,
} from "../_components/blog-qna/BlogTaxonomyManager";

export default async function BlogTopicsPage() {
  await requireBlogAccess();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Topics"
        subtitle="Manage Blog & QnA topics"
        icon={Hash}
        actions={
          <TaxonomyForm
            kind="topic"
            trigger={
              <Button size="sm" className="rounded-lg gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Topic</span>
              </Button>
            }
          />
        }
      />
      <ContentCard>
        <BlogTaxonomyManager kind="topic" />
      </ContentCard>
    </div>
  );
}
