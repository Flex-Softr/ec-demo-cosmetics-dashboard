import { Card } from "@/components/ui/card";
import QnaForm from "@/app/dashboard/_components/blog-qna/QnaForm";
import { requireBlogAccess } from "@/app/dashboard/_components/blog-qna/BlogAccessGate";

const EditQnaPage = async ({ params }: { params: { id: string } }) => {
  await requireBlogAccess();

  return (
    <Card className="m-2 sm:m-4">
      <QnaForm qnaId={params.id} />
    </Card>
  );
};

export default EditQnaPage;
