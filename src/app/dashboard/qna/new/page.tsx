import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleHelp } from "lucide-react";
import Link from "next/link";
import { requireBlogAccess } from "@/app/dashboard/_components/blog-qna/BlogAccessGate";
import QnaForm from "@/app/dashboard/_components/blog-qna/QnaForm";

export default async function NewQnaPage() {
  await requireBlogAccess();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Create QnA"
        subtitle="Add a new question and answer"
        icon={CircleHelp}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
          >
            <Link href="/dashboard/qna">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
        }
      />
      <ContentCard>
        <QnaForm />
      </ContentCard>
    </div>
  );
}
