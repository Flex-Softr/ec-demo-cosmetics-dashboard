import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { FolderTree, Plus } from "lucide-react";
import { requireBlogAccess } from "../_components/blog-qna/BlogAccessGate";
import BlogTaxonomyManager, {
  TaxonomyForm,
} from "../_components/blog-qna/BlogTaxonomyManager";

export default async function BlogCategoriesPage() {
  await requireBlogAccess();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Categories"
        subtitle="Manage Blog & QnA categories"
        icon={FolderTree}
        actions={
          <TaxonomyForm
            kind="category"
            trigger={
              <Button size="sm" className="rounded-lg gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Category</span>
              </Button>
            }
          />
        }
      />
      <ContentCard>
        <BlogTaxonomyManager kind="category" />
      </ContentCard>
    </div>
  );
}
