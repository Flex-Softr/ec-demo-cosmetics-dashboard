import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Tags } from "lucide-react";
import { requireBlogAccess } from "../_components/blog-qna/BlogAccessGate";
import BlogTaxonomyManager, {
  TaxonomyForm,
} from "../_components/blog-qna/BlogTaxonomyManager";

export default async function BlogTagsPage() {
  await requireBlogAccess();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Tags"
        subtitle="Manage Blog & QnA tags"
        icon={Tags}
        actions={
          <TaxonomyForm
            kind="tag"
            trigger={
              <Button size="sm" className="rounded-lg gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Tag</span>
              </Button>
            }
          />
        }
      />
      <ContentCard>
        <BlogTaxonomyManager kind="tag" />
      </ContentCard>
    </div>
  );
}
