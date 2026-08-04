import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import QnaForm from "@/app/dashboard/_components/blog-qna/QnaForm";
import { requireBlogAccess } from "@/app/dashboard/_components/blog-qna/BlogAccessGate";

const EditQnaPage = async ({ params }: { params: { id: string } }) => {
  await requireBlogAccess();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Edit QnA"
        subtitle="Update question and answer details"
        icon={HelpCircle}
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
        <QnaForm qnaId={params.id} />
      </ContentCard>
    </div>
  );
};

export default EditQnaPage;
