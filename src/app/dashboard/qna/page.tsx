import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { CircleHelp, Plus } from "lucide-react";
import Link from "next/link";
import { requireBlogAccess } from "../_components/blog-qna/BlogAccessGate";
import QnaManager from "../_components/blog-qna/QnaManager";

export default async function QnaPage() {
  await requireBlogAccess();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="QnA"
        subtitle="Create and manage questions and answers"
        icon={CircleHelp}
        actions={
          <Button asChild size="sm" className="rounded-lg gap-1.5">
            <Link href="/dashboard/qna/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New QnA</span>
            </Link>
          </Button>
        }
      />
      <ContentCard>
        <QnaManager />
      </ContentCard>
    </div>
  );
}
