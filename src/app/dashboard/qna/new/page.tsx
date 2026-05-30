import { Card } from "@/components/ui/card";
import { requireBlogAccess } from "@/app/dashboard/_components/blog-qna/BlogAccessGate";
import QnaForm from "@/app/dashboard/_components/blog-qna/QnaForm";

export default async function NewQnaPage() {
  await requireBlogAccess();

  return (
    <Card className="m-2 sm:m-4">
      <QnaForm />
    </Card>
  );
}
